
import Proposal from "../model/proposalModel.js";
import Company from "../model/comanieModel.js";
import { successResponse, errorResponse } from "../helpers/response.js";
import { UploadBufferToCloudinary } from "../helpers/Cloudinary.js";
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
        let fileUrl, filePublicId;
        if (req.file) {
            const uploadResult = await UploadBufferToCloudinary(req.file.buffer, "blueprint/proposals", "raw", req.file.originalname);
            fileUrl = uploadResult.secureUrl;
            filePublicId = uploadResult.publicId;
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
            ...(fileUrl && { file : fileUrl, filePublicId}),
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
        const proposal = await Proposal.findById(id)
            .populate("fromCompany", "name legalName logo")
            .populate("toCompany", "name legalName logo")
            .populate("createdBy", "name email");

        if (!proposal) {
            return errorResponse(res, { statusCode: 404, message: "Proposal not found" });
        }

         // Always include the thread so the detail page has everything in one call
        const texts = await ProposalText.find({ proposal: id })
            .sort({ createdAt: 1 })
            .populate("senderCompany", "name legalName logo")
            .populate("senderUser", "name email");

        return successResponse(res, {
            statusCode: 200,
            message: "Proposal fetched successfully",
            payload: { proposal, texts },
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