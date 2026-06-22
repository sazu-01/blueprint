

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
    logo: {
        type: String,
    },
    publicId:{
        type: String,
    },
    country: {
        type: String,
    },
    address: {
        type: String,  
    },
    companyType: {
        type: String,
        enum: ["Partnership", "Educational", "Privately held", "Government Agency", "Non Profit", "Public Company", "Self Employed", "Self Owned"]
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
    timestamps: true 
});


const Company = model("Company", companieSchema);

export default Company;