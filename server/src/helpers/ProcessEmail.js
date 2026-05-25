

"use strict";

//helper function
import { SendEmail } from "./nodemailer.js";

const ProcessEmail = async (emailData) => {
    try {
         await SendEmail(emailData);
       } catch (error) {
           throw error;

       }
 }

 export default ProcessEmail;
