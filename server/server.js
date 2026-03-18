
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import { serverPort } from "./src/hiddenEnv.js";


const startServer = async () => {
  try {
     await connectDB();
     app.listen(serverPort, () => {
      console.log(`server running at http://localhost:${serverPort}`);
     })
  } catch (error) {
    console.log(`Failed to start server: ${error}`);
    process.exit(1);
  }
} 

startServer();

