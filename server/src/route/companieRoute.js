
import express from "express";
import { createCompanyController, getAllCompanies, getCompanyByLegalName, UpdateCompanyController } from "../controller/companieController.js";
import { IsLoggedIn } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadFile.js";

const companieRoute = express.Router();

companieRoute.post("/register/company", IsLoggedIn, upload.single('logo'), createCompanyController);
companieRoute.get("/companies/all-company", getAllCompanies);
companieRoute.get("/company", getCompanyByLegalName);
companieRoute.patch(
    "/company/:id",
    IsLoggedIn,
    upload.single("logo"),
    UpdateCompanyController
);

export default companieRoute;