
import dotenv from "dotenv";

dotenv.config();

const MongodbURL = process.env.MongodbURL;
const serverPort = process.env.serverPort;
const smtpUserName = process.env.smtpUserName;
const smtpPassword = process.env.smtpPassword;
const OTP_EXPIRES_IN_MINUTES = parseInt(process.env.OTP_EXPIRES_IN_MINUTES || 5) || 5;
const JWT_SECRET = process.env.JWT_SECRET;
const DEVELOPMENT_CLIENT_URL=process.env.DEVELOPMENT_CLIENT_URL;
const PRODUCTION_CLIENT_URL=process.env.PRODUCTION_CLIENT_URL;
const NODE_ENV=process.env.NODE_ENV;
const BREVO_API_KEY=process.env.BREVO_API_KEY;
const CLOUDE_NAME= process.env.CLOUDE_NAME;
const CLOUDE_API_KEY=process.env.CLOUDE_API_KEY;
const CLOUDE_API_SECRET=process.env.CLOUDE_API_SECRET;
const R2_BUCKET=process.env.R2_BUCKET;
const R2_ACCOUNT_ID=process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID=process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY=process.env.R2_SECRET_ACCESS_KEY;


export {
    MongodbURL,
    serverPort,
    smtpUserName,
    smtpPassword,
    OTP_EXPIRES_IN_MINUTES,
    JWT_SECRET,
    DEVELOPMENT_CLIENT_URL,
    PRODUCTION_CLIENT_URL,
    NODE_ENV,
    BREVO_API_KEY,
    CLOUDE_NAME,
    CLOUDE_API_KEY,
    CLOUDE_API_SECRET,
    R2_BUCKET,
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY
}
