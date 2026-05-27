
import express from "express";
import authRouter from "./route/authRoute.js";
import cors from "cors";

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
app.use("/api/auth", authRouter);

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
