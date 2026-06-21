
import express from "express";
import { SendText, GetText } from "../controller/proposalTextController.js";
import { IsLoggedIn } from "../middleware/authMiddleware.js";

const proposalTextRoute = express.Router();

proposalTextRoute.post("/proposal/:proposalId/text", IsLoggedIn, SendText);
proposalTextRoute.get("/proposal/:proposalId/text", IsLoggedIn, GetText);

export default proposalTextRoute;