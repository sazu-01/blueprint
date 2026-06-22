
import User from "../model/userModel.js";
import { successResponse, errorResponse } from "../helpers/response.js";


// GET ALL USERS
const GetUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        return successResponse(res, {
            statusCode: 200,
            message: "Users fetched successfully",
            payload: { users },
        });
    } catch (error) {
        next(error);
    }
};


// GET USER BY ID
const GetUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return errorResponse(res, { statusCode: 404, message: "User not found" });
        }

        return successResponse(res, {
            statusCode: 200,
            message: "User fetched successfully",
            payload: { user },
        });
    } catch (error) {
        next(error);
    }
};


// UPDATE USER — only the user themself can update their own profile
const UpdateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const requestingUserId = req.user._id.toString();

        if (requestingUserId !== id) {
            return errorResponse(res, {
                statusCode: 403,
                message: "You are not authorized to update this user",
            });
        }

        const { email, position } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return errorResponse(res, { statusCode: 404, message: "User not found" });
        }

        if (email !== undefined) {
            const normalizedEmail = email.trim().toLowerCase();

            const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });
            if (existing) {
                return errorResponse(res, {
                    statusCode: 409,
                    message: "This email is already in use",
                });
            }

            user.email = normalizedEmail;
            user.isVerified = false; // changing email requires re-verification
        }

        if (position !== undefined) {
            user.position = position.trim();
        }

        await user.save();

        return successResponse(res, {
            statusCode: 200,
            message: "User updated successfully",
            payload: { user },
        });
    } catch (error) {
        next(error);
    }
};


// DELETE USER — only the user themself can delete their account
const DeleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const requestingUserId = req.user._id.toString();

        if (requestingUserId !== id) {
            return errorResponse(res, {
                statusCode: 403,
                message: "You are not authorized to delete this user",
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return errorResponse(res, { statusCode: 404, message: "User not found" });
        }

        await user.deleteOne();

        return successResponse(res, {
            statusCode: 200,
            message: "User account deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export { GetUsers, GetUserById, UpdateUser, DeleteUser };