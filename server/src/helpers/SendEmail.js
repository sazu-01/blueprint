
import axios from "axios"
import { BREVO_API_KEY } from "../hiddenEnv.js";


const SendEmail = async (emailData) => {
  try {
    const { email, subject, html } = emailData;

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Blueprint",
          email: "p.mizan2441@gmail.com",
        },
        to: [
          {
            email: email,
          },
        ],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};

export { SendEmail };







