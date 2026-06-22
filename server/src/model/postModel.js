
import { Schema, model } from "mongoose";

const postSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 3000,
        },

        postType: {
            type: String,
            enum: [
                "Partnership",
                "Investment",
                "Collaboration",
                "Project",
                "Vendor Search",
                "Procurement",
                "Networking",
                "Distribution",
                "Acquisition",
                "Joint Venture",
            ],
            required: true,
        },

        relatedIndustry: {
            type: [String],
            default: [],
        },

        isEdited: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Post = model("Post", postSchema);

export default Post;