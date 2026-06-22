
import express from "express";
import {
    GetUsers,
    GetUserById,
    UpdateUser,
    DeleteUser,
} from "../controller/userController.js";
import { IsLoggedIn } from "../middleware/authMiddleware.js";

const userRoute = express.Router();

userRoute.get("/user/all-user", IsLoggedIn, GetUsers);
userRoute.get("/user/:id", IsLoggedIn, GetUserById);
userRoute.patch("/user/:id", IsLoggedIn, UpdateUser);
userRoute.delete("/user/:id", IsLoggedIn, DeleteUser);

export default userRoute;