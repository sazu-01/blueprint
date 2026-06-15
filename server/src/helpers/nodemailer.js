

import nodemailer from "nodemailer";
import { smtpUserName, smtpPassword } from "../hiddenEnv.js";

const transporter = nodemailer.createTransport({

  host: "smtp-relay.brevo.com", // Brevo SMTP server
  port: 587, // Use 587 for TLS
  secure: false, // `false` because i am using TLS
  auth: {
    user: smtpUserName, 
    pass: smtpPassword, 
  },
});

// const SendEmail = async (emailData) => {
//   try {
//     const { email, subject, html } = emailData;
//       console.log(`on sendemail fun`)
//     const mailOptions = {
//       from: `"Blueprint"<sazu2441@gmail.com>`,
//       to: email,
//       subject: subject,
//       html: html, 
//     };

//    await transporter.sendMail(mailOptions);

//   } catch (error) {
//     console.error("❌ Error sending email:", error);
//     throw error;
//   }
// };


const SendEmail = async (emailData) => {
  try {
    console.log("📡 SMTP: Preparing email...");

    const { email, subject, html } = emailData;

    const mailOptions = {
      from: `"Blueprint" <${smtpUserName}>`,
      to: email,
      subject,
      html,
    };

    console.log("📡 SMTP: Sending request...");

    const info = await transporter.sendMail(mailOptions);

    console.log("📡 SMTP SUCCESS:", info.response);

    return info;

  } catch (error) {
    console.error("❌ SMTP RAW ERROR:");
    console.error(error); // THIS is key

    throw error;
  }
};

export { SendEmail };







