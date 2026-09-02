
import express from "express";
import { SendText, GetText } from "../controller/proposalTextController.js";
import { IsLoggedIn } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadFile.js";


const proposalTextRoute = express.Router();

proposalTextRoute.post("/proposal/:proposalId/text", IsLoggedIn, upload.single("file"), SendText);
proposalTextRoute.get("/proposal/:proposalId/text", IsLoggedIn, GetText);

export default proposalTextRoute;