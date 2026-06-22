
import express from "express";
import authRouter from "./route/authRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import companieRoute from "./route/companieRoute.js";
import proposalRoute from "./route/proposalRoute.js";
import proposalTextRoute from "./route/proposalTextRoute.js";
import postRoute from "./route/postRoute.js";
import userRoute from "./route/userRoute.js";

const app = express();

const corsOption = {
    origin : ["http://localhost:3000", "https://blueprintt.vercel.app"],
    credentials : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

//middleware
app.use((cors(corsOption)))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/auth", authRouter);
app.use("/api", userRoute);
app.use("/api", companieRoute);
app.use("/api", proposalRoute);
app.use("/api", proposalTextRoute);
app.use("/api", postRoute);

app.get("/", (req, res) => {
    res.status(200).send("welcome to server");
});

app.use((req, res) => {
    res.status(404).send({
        message: "Route not found",
    });
});

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).send({
        message: "Internal server error",
    });
});

export default app;
