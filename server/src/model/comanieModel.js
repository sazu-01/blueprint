

import {Schema, model} from "mongoose";

const companieSchema = new Schema({
    // REQUIRED FIELDS
    name: {
        type: String,
        required: true,
    },
    legalName: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    industryVertical: {
        type: Array,
        required: true,
    },
    businessActivity: {
        type: Array,
        required: true,
    },
    interestedIndustries: {
        type: Array,
        required: true,
    },
    
    // OPTIONAL FIELDS
    country: {
        type: String,
    },
    address: {
        type: String,  
    },
    companyType: {
        type: String,
    },
    webLink: {
        type: String,
    },
    companySize: {
        type: String
    },
    foundedYear: {
        type: String,
    },
    fundingStaged: {
        type: String,
    },
    officialDomain: {
        type: String
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
    verificationStatus: {  // For future verification feature
        type: String,
        enum: ["Unverified", "Pending", "Verified"],
        default: "Unverified",
    },
}, 
{ 
    timestamps: true  // ✅ createdAt, updatedAt automatic
});


const Company = model("companies", companieSchema);

export default Company;