
import mongoose from "mongoose";
import { MongodbURL } from "../hiddenEnv.js"


const connectDB = async () => {
    try {
    await mongoose.connect(`${MongodbURL}`)
    console.log("Connected to Database successfully");

    } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Stop the server if DB fails  
    }
}

export default connectDB;