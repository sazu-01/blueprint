
import express from "express";
import { createCompanyController, getAllCompanies, getCompanyByLegalName } from "../controller/companieController.js";
import { IsLoggedIn } from "../middleware/authMiddleware.js";


const companieRoute = express.Router();

companieRoute.post("/register/company", IsLoggedIn, createCompanyController);
companieRoute.get("/companies/all-company", getAllCompanies);
companieRoute.get("/company", getCompanyByLegalName);

export default companieRoute;