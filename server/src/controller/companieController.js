

import Company from "../model/comanieModel.js";
import { errorResponse, successResponse } from "../helpers/response.js";

const createCompanyController = async (req, res, next) => {
    try {
        // 1. Extract required fields
        const { name, legalName, description, industryVertical, businessActivity, interestedIndustries } = req.body;
        
        // 2. Validate required fields
        if (!name || !legalName || !description || !industryVertical || !businessActivity || !interestedIndustries) {
            return errorResponse(res, {
                statusCode: 400,
                message: "All required fields must be provided"
            });
        }

        // 3. Check if company with same legalName already exists
        const existingCompany = await Company.findOne({ legalName });
        if (existingCompany) {
            return errorResponse(res, {
                statusCode: 409,
                message: "Company with this legal name already exists"
            });
        }

        // 4. Create new company
        const newCompany = new Company({
            name,
            legalName,
            description,
            industryVertical,
            businessActivity,
            interestedIndustries,
            
            // Optional fields (if provided)
            ...(req.body.country && { country: req.body.country }),
            ...(req.body.address && { address: req.body.address }),
            ...(req.body.companyType && { companyType: req.body.companyType }),
            ...(req.body.webLink && { webLink: req.body.webLink }),
            ...(req.body.companySize && { companySize: req.body.companySize }),
            ...(req.body.foundedYear && { foundedYear: req.body.foundedYear }),
            ...(req.body.fundingStaged && { fundingStaged: req.body.fundingStaged }),
            ...(req.body.officialDomain && { officialDomain: req.body.officialDomain }),
        });

        // 5. Save to database
        const savedCompany = await newCompany.save();

        // 6. Return success response
        return successResponse(res, {
            statusCode: 201,
            message: "Company created successfully",
            payload: {
                companyId: savedCompany._id,
                name: savedCompany.name,
                legalName: savedCompany.legalName,
                industryVertical: savedCompany.industryVertical,
                verificationStatus: savedCompany.verificationStatus,
                createdAt: savedCompany.createdAt,
            }
        });

    } catch (error) {
        console.error("Error in createCompanyController:", error);
        
        return errorResponse(res, {
            statusCode: 500,
            message: "Error creating company"
        });
    }
};


const getAllCompanies = async (req, res, next) => {
    try {
        
        const companies = await Company.find({});

        return successResponse(res,{
            statusCode: 200,
            message : "return all the companies",
            payload: {
                companies,
            }
        })
    } catch (error) {
        console.error("Error in :", error);
        return errorResponse(res, {
            statusCode: 500,
            message: "Error in getting all the company"
        });
    }
}

export { createCompanyController, getAllCompanies };
