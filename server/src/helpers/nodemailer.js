

import nodemailer from "nodemailer";
import { smtpUsername, smtpPassword } from "../hiddenEnv.js";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Brevo SMTP server
  port: 587, // Use 587 for TLS
  secure: false, // `false` because i am using TLS
  auth: {
    user: smtpUsername, 
    pass: smtpPassword, 
  },
});

const SendEmail = async (emailData) => {
  try {
    const { email, subject, html } = emailData;

    const mailOptions = {
      from: `"Blueprint"<sazu2441@gmail.com>`,
      to: email,
      subject: subject,
      html: html, 
    };

   await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

export { SendEmail };







