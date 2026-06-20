import express from "express";
import {
    GetProposalById,
    GetCompanyProposals,
    CreateProposal,
    RespondToProposal,
} from "../controller/proposalController.js";
import { IsLoggedIn } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadFile.js";

const proposalRoute = express.Router();

proposalRoute.post(
    "/proposal/create-proposal",
    IsLoggedIn,
    upload.single("file"),
    CreateProposal
);

proposalRoute.get("/proposal/all-proposal/:companyId", IsLoggedIn, GetCompanyProposals);

proposalRoute.patch("/proposal/respond/:id", IsLoggedIn, RespondToProposal);

proposalRoute.get("/proposal/:id", IsLoggedIn, GetProposalById);

export default proposalRoute;