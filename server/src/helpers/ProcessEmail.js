
"use strict";

import { SendEmail } from "./SendEmail.js";


const ProcessEmail = async (emailData) => {
    try {
        await SendEmail(emailData);
    } catch (error) {
         console.error("❌ EMAIL FAILED:", error.response?.data || error.message);
         throw error;
    }
};

 export default ProcessEmail;
