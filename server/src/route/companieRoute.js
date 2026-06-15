
import express from "express";
import { createCompanyController, getAllCompanies } from "../controller/companieController.js";
import { IsLoggedIn } from "../middleware/authMiddleware.js";


const companieRoute = express.Router();

companieRoute.post("/register/company", IsLoggedIn, createCompanyController);
companieRoute.get("/companies/all-company", getAllCompanies)

export default companieRoute;