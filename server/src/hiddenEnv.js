
import dotenv from "dotenv";

dotenv.config();

const MongodbURL = process.env.MongodbURL;
const serverPort = process.env.serverPort;
const smtpUsername = process.env.smtpUsername;
const smtpPassword = process.env.smtpPassword;
const OTP_EXPIRES_IN_MINUTES = parseInt(process.env.OTP_EXPIRES_IN_MINUTES || 5) || 5;
const JWT_SECRET = process.env.JWT_SECRET;
const DEVELOPMENT_CLIENT_URL=process.env.DEVELOPMENT_CLIENT_URL;
const PRODUCTION_CLIENT_URL=process.env.PRODUCTION_CLIENT_URL;

export {
    MongodbURL,
    serverPort,
    smtpUsername,
    smtpPassword,
    OTP_EXPIRES_IN_MINUTES,
    JWT_SECRET,
    DEVELOPMENT_CLIENT_URL,
    PRODUCTION_CLIENT_URL
}
