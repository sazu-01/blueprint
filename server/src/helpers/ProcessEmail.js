

"use strict";

//helper function
import { SendEmail } from "./nodemailer.js";

// const ProcessEmail = async (emailData) => {
//      console.log("📨 EMAIL STEP 1: ProcessEmail started");
//     try {
//          console.log(`on sendemail fun`)
//          await SendEmail(emailData);
//        } catch (error) {
//            throw error;

//        }
//  }


const ProcessEmail = async (emailData) => {
    console.log("📨 EMAIL: Starting process");

    try {
        await SendEmail(emailData);
        console.log("📨 EMAIL: Success");
    } catch (error) {
        console.error("❌ EMAIL REAL ERROR:");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Response:", error.response);
        console.error("Stack:", error.stack);

        // IMPORTANT: throw structured error
        const enhancedError = new Error("EMAIL_FAILED");
        enhancedError.details = {
            message: error.message,
            code: error.code,
            response: error.response,
        };

        throw enhancedError;
    }
};

 export default ProcessEmail;
