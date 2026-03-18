
import dotenv from "dotenv";

dotenv.config();

const MongodbURL = process.env.MongodbURL;
const serverPort = process.env.serverPort;

export {
    MongodbURL,
    serverPort
}
