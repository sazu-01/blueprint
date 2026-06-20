

import mongoose, { Schema, model } from "mongoose";

const proposalSchema = new Schema({

    proposalId: {
        type: String,
        required: true,
        unique: true
    },

    proposalType : {
        type : String, 
        enum: ["Acquisition", "Collaboration", "Distribution", "Investment", "Joint Venture", "Networking", "Partnership", "Project",  "Vendor search"],
        required: true,
    },

    fromCompany: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },

    toCompany: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },

    status: {
        type: String,
        enum: ["draft", "sent", "reviewing", "negotiate", "accepted", "rejected"],
        default: "draft"
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    file: {
        type: String,
    },

    rejectionReason: {
        type : String,
    }

}, { timestamps: true });

const Proposal = model("Proposal", proposalSchema);

export default Proposal;

