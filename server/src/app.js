import express from "express";
import authRouter from "./route/authRoute.js";

const app = express();

const allowedOrigins = new Set([
    "http://localhost:3000",
]);

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.has(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
    }

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

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
