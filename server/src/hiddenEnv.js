
import dotenv from "dotenv";

dotenv.config();

const MongodbURL = process.env.MongodbURL;
const serverPort = process.env.serverPort;
const smtpUsername = process.env.smtpUsername;
const smtpPassword = process.env.smtpPassword;
const OTP_EXPIRES_IN_MINUTES = parseInt(process.env.OTP_EXPIRES_IN_MINUTES || 5) || 5;

export {
    MongodbURL,
    serverPort,
    smtpUsername,
    smtpPassword,
    OTP_EXPIRES_IN_MINUTES
}
