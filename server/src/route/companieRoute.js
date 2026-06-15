

import express from "express";
import { createCompanyController, getAllCompanies } from "../controller/companieController.js";

const companieRoute = express.Router();


companieRoute.post("/register/company", createCompanyController);
companieRoute.get("/companies/all-company", getAllCompanies)

export default companieRoute;