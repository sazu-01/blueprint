

import { Schema, model } from "mongoose";

const ProposalTextSchema = new Schema({
    proposal: {
        type: Schema.Types.ObjectId,
        ref: "Proposal",
        required: true,
    },
    senderCompany: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    senderUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });

ProposalTextSchema.index({ proposal: 1, createdAt: 1 });

const ProposalText = model("ProposalText", ProposalTextSchema);
export default ProposalText;