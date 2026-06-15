import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../hiddenEnv.js";
import { errorResponse } from "../helpers/response.js";
import User from "../model/userModel.js";


const IsLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return errorResponse(res, {
                statusCode: 401,
                message: "Access denied. Please log in first.",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return errorResponse(res, {
                statusCode: 401,
                message: "User not found. Token is invalid.",
            });
        }

        if (!user.isVerified) {
            return errorResponse(res, {
                statusCode: 403,
                message: "Please verify your email first.",
            });
        }

        req.user = user;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return errorResponse(res, {
                statusCode: 401,
                message: "Session expired. Please log in again.",
            });
        }
        if (error.name === "JsonWebTokenError") {
            return errorResponse(res, {
                statusCode: 401,
                message: "Invalid token. Please log in again.",
            });
        }
        next(error);
    }
};

// ✅ Only allows unauthenticated users (blocks already logged-in users)
const IsLoggedOut = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return next(); 
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded) {
            return errorResponse(res, {
                statusCode: 400,
                message: "You are already logged in.",
            });
        }

    } catch (error) {
        // Expired or invalid token = treat as logged out = allow through
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError"
        ) {
            return next();
        }
        next(error);
    }
};

export { IsLoggedIn, IsLoggedOut };