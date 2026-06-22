

import Post from "../model/postModel.js";
import Company from "../model/comanieModel.js";
import { successResponse, errorResponse } from "../helpers/response.js";

const isCompanyMember = async (companyId, userId) => {
    return await Company.exists({ _id: companyId, createdBy: userId });
};


const CreatePost = async (req, res, next) => {
    try {
        const { company, content, postType, relatedIndustry } = req.body;
        const userId = req.user._id;

        if (!company || !content || !postType) {
            return errorResponse(res, {
                statusCode: 400,
                message: "company, content, and postType are required",
            });
        }

        const isMember = await isCompanyMember(company, userId);
        if (!isMember) {
            return errorResponse(res, {
                statusCode: 403,
                message: "You are not authorized to post on behalf of this company",
            });
        }

        const post = await Post.create({
            author: userId,
            company,
            content: content.trim(),
            postType,
            relatedIndustry: relatedIndustry || [],
        });

        const populatedPost = await Post.findById(post._id)
            .populate("author", "name email")
            .populate("company", "name legalName logo");

        return successResponse(res, {
            statusCode: 201,
            message: "Post created successfully",
            payload: { post: populatedPost },
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------
// GET FEED — all posts, optionally filtered by industry / postType
// ---------------------------------------------
const GetAllPosts = async (req, res, next) => {
    try {
        const { industry, postType, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (industry) filter.relatedIndustry = industry; // matches if industry is in the array
        if (postType) filter.postType = postType;

        const skip = (Number(page) - 1) * Number(limit);

        const posts = await Post.find(filter)
            .populate("author", "name email")
            .populate("company", "name legalName logo")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Post.countDocuments(filter);

        return successResponse(res, {
            statusCode: 200,
            message: "Posts fetched successfully",
            payload: {
                posts,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / Number(limit)),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};



const GetPostById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id)
            .populate("author", "name email")
            .populate("company", "name legalName logo");

        if (!post) {
            return errorResponse(res, { statusCode: 404, message: "Post not found" });
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Post fetched successfully",
            payload: { post },
        });
    } catch (error) {
        next(error);
    }
};


const UpdatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content, postType, relatedIndustry } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(id);
        if (!post) {
            return errorResponse(res, { statusCode: 404, message: "Post not found" });
        }

        if (post.author.toString() !== userId.toString()) {
            return errorResponse(res, {
                statusCode: 403,
                message: "You are not authorized to edit this post",
            });
        }

        if (content !== undefined) post.content = content.trim();
        if (postType !== undefined) post.postType = postType;
        if (relatedIndustry !== undefined) post.relatedIndustry = relatedIndustry;
        post.isEdited = true;

        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate("author", "name email")
            .populate("company", "name legalName logo");

        return successResponse(res, {
            statusCode: 200,
            message: "Post updated successfully",
            payload: { post: populatedPost },
        });
    } catch (error) {
        next(error);
    }
};


const DeletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(id);
        if (!post) {
            return errorResponse(res, { statusCode: 404, message: "Post not found" });
        }

        if (post.author.toString() !== userId.toString()) {
            return errorResponse(res, {
                statusCode: 403,
                message: "You are not authorized to delete this post",
            });
        }

        await post.deleteOne();

        return successResponse(res, {
            statusCode: 200,
            message: "Post deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export { CreatePost, GetAllPosts, GetPostById, UpdatePost, DeletePost };