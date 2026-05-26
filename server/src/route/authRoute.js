
import express from "express";
import {
    ActivateUser,
    RequestUserRegistration,
    LoginUser,
} from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/register/user", RequestUserRegistration);
authRouter.post("/register/user/activate", ActivateUser);
authRouter.post("/login/user", LoginUser)

export default authRouter;
