import express from "express";
import {
    ActivateUser,
    RequestUserRegistration,
} from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/register/user", RequestUserRegistration);
authRouter.post("/register/user/activate", ActivateUser);

export default authRouter;
