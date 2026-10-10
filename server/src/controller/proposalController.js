
import Proposal from "../model/proposalModel.js";
import Company from "../model/comanieModel.js";
import { successResponse, errorResponse } from "../helpers/response.js";
import { UploadBufferToR2, GetR2SignedUrl } from "../helpers/R2.js";
import ProposalText from "../model/proposalTextModel.js";


// Quick helper: confirm the logged-in user actually belongs to a given company
const isCompanyMember = async (companyId, userId) => {
    return await Company.exists({
        _id: companyId,
        $or: [{ primaryOwner: userId }, { createdBy: userId }],
    });
};

const generateProposalId = () => {
    const year = new Date().getFullYear();
    const random = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `BP-${year}-${random}`;
};

const VALID_TRANSITIONS = {
    sent: ["reviewing", "negotiate", "accepted", "rejected"],
    reviewing: ["negotiate", "accepted", "rejected"],
    negotiate: ["accepted", "rejected"],
};


const CreateProposal = async (req, res, next) => {
    try {
        const { proposalType, fromCompany, toCompany, text } = req.body;
        const userId = req.user._id;

        if (!proposalType || !fromCompany || !toCompany) {
            return errorResponse(res, {
                statusCode: 400,
                message: "proposalType, fromCompany, and toCompany are required",
            })
        }

        // Must have at least text or a file
        if((!text || !text.trim()) && !req.file) {
            return errorResponse(res, {
                statusCode: 400,
                message: "A proposal must include a message or an attached document"
            })
        }

        if (fromCompany === toCompany) {
            return errorResponse(res, {
                statusCode: 400,
                message: "company cannot send proposal to itself",
            })
        }

        const isMember = await isCompanyMember(fromCompany, userId);
        if (!isMember) {
            return errorResponse(res, {
                statusCode: 403,
                message: "you are not authorized to send proposals on behalf of this company"
            })
        }

        const toCompanyExist = await Company.exists({ _id: toCompany });
        if (!toCompanyExist) {
            return errorResponse(res, {
                statusCode: 404,
                message: "Receiving company not found"
            })
        }
        
        //upload file if attached
        let fileKey;
        if (req.file) {
        const { key } = await UploadBufferToR2(req.file.buffer,`proposals/${fromCompany}`,
        req.file.originalname,req.file.mimetype
        );
        fileKey = key; 
        } 

        let proposal;
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                proposal = await Proposal.create({
                    proposalId: generateProposalId(),
                    proposalType,
                    fromCompany,
                    toCompany,
                    createdBy: userId,
                    status: "sent",
                });
                break;
            } catch (error) {
                if (error.code === 11000 && attempt === 0) continue;
                throw error;
            }
        }


        // create first proposal content
        const firstMessage = await ProposalText.create({
            proposal: proposal._id,
            senderCompany: fromCompany,
            senderUser: userId,
            text: text?.trim() || "",
            ...(fileKey && { fileKey }),
        });

        return successResponse(res, {
            statusCode: 201,
            message: "Proposal Sent Successfully",
            payload: { proposal, firstMessage }
        })

    } catch (error) {
        next(error);
    }
}


const GetProposalById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const proposal = await Proposal.findById(id)
            .populate("fromCompany", "name legalName logo")
            .populate("toCompany", "name legalName logo")
            .populate("createdBy", "name email");

        if (!proposal) {
            return errorResponse(res, { statusCode: 404, message: "Proposal not found" });
        }



        // only sender or receiver company people can see this proposal
        const [isSender, isReceiver] = await Promise.all([
            isCompanyMember(proposal.fromCompany._id, userId),
            isCompanyMember(proposal.toCompany._id, userId),
        ]);
        if (!isSender && !isReceiver) {
            return errorResponse(res, {
                statusCode: 403,
                message: "You are not authorized to view this proposal",
            });
        }


         // Always include the thread so the detail page has everything in one call
        const texts = await ProposalText.find({ proposal: id })
            .sort({ createdAt: 1 })
            .populate("senderCompany", "name legalName logo")
            .populate("senderUser", "name email");


        // R2 ফাইলের জন্য signed URL বসিয়ে দেওয়া; frontend আগের মতোই `file` ফিল্ড পাবে
        const textsWithUrls = await Promise.all(
            texts.map(async (t) => {
                const obj = t.toObject();
                if (obj.fileKey) {
                    obj.file = await GetR2SignedUrl(obj.fileKey);
                }
                return obj;
            })
        );   

        return successResponse(res, {
            statusCode: 200,
            message: "Proposal fetched successfully",
            payload: { proposal, texts:textsWithUrls },
        });
    } catch (error) {
        next(error);
    }
}


const GetCompanyProposals = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const { direction } = req.query; // "sent" | "received" | undefined (both)

        let filter;
        if (direction === "sent") {
            filter = { fromCompany: companyId };
        } else if (direction === "received") {
            filter = { toCompany: companyId };
        } else {
            filter = { $or: [{ fromCompany: companyId }, { toCompany: companyId }] };
        }

        const proposals = await Proposal.find(filter)
            .populate("fromCompany", "name legalName logo")
            .populate("toCompany", "name legalName logo")
            .sort({ createdAt: -1 });

        return successResponse(res, {
            statusCode: 200,
            message: "Proposals fetched successfully",
            payload: { proposals },
        });
    } catch (error) {
        next(error);
    }
};


const RespondToProposal = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        const userId = req.user._id;

        const proposal = await Proposal.findById(id);
        if (!proposal) {
            return errorResponse(res, { statusCode: 404, message: "Proposal not found" });
        }

        const isMember = await isCompanyMember(proposal.toCompany, userId);
        if (!isMember) {
            return errorResponse(res, {
                statusCode: 403,
                message: "Only the receiving company can respond to this proposal",
            });
        }

        const allowedNext = VALID_TRANSITIONS[proposal.status] || [];
        if (!allowedNext.includes(status)) {
            return errorResponse(res, {
                statusCode: 400,
                message: `Cannot change status from "${proposal.status}" to "${status}"`,
            });
        }

        if (status === "rejected") {
            if (!rejectionReason || !rejectionReason.trim()) {
                return errorResponse(res, {
                    statusCode: 400,
                    message: "A rejection reason is required",
                });
            }
            proposal.rejectionReason = rejectionReason.trim();
        }

        proposal.status = status;
        await proposal.save();

        return successResponse(res, {
            statusCode: 200,
            message: `Proposal status updated to "${status}"`,
            payload: { proposal },
        });
    } catch (error) {
        next(error);
    }
};

export { CreateProposal, GetProposalById, GetCompanyProposals, RespondToProposal}