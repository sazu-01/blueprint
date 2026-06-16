
import express from "express";
import {
    ActivateUser,
    RequestUserRegistration,
    LoginUser,
    LogoutUser
} from "../controller/authController.js";
import { IsLoggedIn, IsLoggedOut } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register/user", RequestUserRegistration);
authRouter.post("/register/user/activate", ActivateUser);
authRouter.post("/login/user",IsLoggedOut, LoginUser)
authRouter.post("/logout/user",IsLoggedIn, LogoutUser);

export default authRouter;
