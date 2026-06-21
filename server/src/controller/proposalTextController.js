import Proposal from "../model/proposalModel.js";
import Company from "../model/comanieModel.js";
import ProposalText from "../model/proposalTextModel.js";
import { successResponse, errorResponse } from "../helpers/response.js";

const isCompanyMember = async (companyId, userId) => {
    return await Company.exists({ _id: companyId, createdBy: userId });
};

// ---------------------------------------------
// SEND MESSAGE — only allowed once status is "negotiate" or "accepted"
// ---------------------------------------------
const SendText = async (req, res, next) => {
    try {
        const { proposalId } = req.params; // Mongo _id of the Proposal doc
        const { senderCompany, text } = req.body;
        const userId = req.user._id;

        if (!senderCompany) {
            return errorResponse(res, { statusCode: 400, message: "senderCompany is required" });
        }

        if (!text || !text.trim()) {
            return errorResponse(res, { statusCode: 400, message: "Message text is required" });
        }

        const proposal = await Proposal.findById(proposalId);
        if (!proposal) {
            return errorResponse(res, { statusCode: 404, message: "Proposal not found" });
        }

        if (!["negotiate", "accepted"].includes(proposal.status)) {
            return errorResponse(res, {
                statusCode: 400,
                message: "Messaging is only available once a proposal is in negotiation or accepted",
            });
        }

        // senderCompany must be one of the two companies on this proposal
        const isParticipant =
            senderCompany === proposal.fromCompany.toString() ||
            senderCompany === proposal.toCompany.toString();

        if (!isParticipant) {
            return errorResponse(res, {
                statusCode: 403,
                message: "This company is not a participant in this proposal",
            });
        }

        // and the logged-in user must actually belong to that company
        const isMember = await isCompanyMember(senderCompany, userId);
        if (!isMember) {
            return errorResponse(res, {
                statusCode: 403,
                message: "You are not authorized to message on behalf of this company",
            });
        }

        const newText = await ProposalText.create({
            proposal: proposalId,
            senderCompany,
            senderUser: userId,
            text: text.trim(),
        });

        return successResponse(res, {
            statusCode: 201,
            message: "Message sent",
            payload: { text: newText },
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------
// GET MESSAGE THREAD for a proposal
// ---------------------------------------------
const GetText = async (req, res, next) => {
    try {
        const { proposalId } = req.params;

        const proposal = await Proposal.exists({ _id: proposalId });
        if (!proposal) {
            return errorResponse(res, { statusCode: 404, message: "Proposal not found" });
        }

        const texts = await ProposalText.find({ proposal: proposalId })
            .sort({ createdAt: 1 })
            .populate("senderCompany", "name legalName logo")
            .populate("senderUser", "name email");

        return successResponse(res, {
            statusCode: 200,
            message: "Messages fetched successfully",
            payload: { texts },
        });
    } catch (error) {
        next(error);
    }
};

export { SendText, GetText };