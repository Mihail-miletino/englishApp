import https from "node:https";
import fs from "node:fs";
import express from "express";
import mongoose from "mongoose";
import config from "config";
import {AuthRouter} from "./routes/auth.routes.js";
import {CreateRouter} from "./routes/create.routes.js";
import {RecordsRouter} from "./routes/records.routes.js";
import {QuizRouter} from "./routes/quiz.routes.js";
import {verifyTokenMiddleware} from "./middleware/verifyToken.middleware.js";

const app = express();

const HOST = config.get("HOST");
const PORT = config.get("PORT");
const mongoURI = config.get("mongoURI");

const httpsOptions = {
    key: fs.readFileSync("/Users/michail/localhost+2-key.pem", "utf-8"),
    cert: fs.readFileSync("/Users/michail/localhost+2.pem", "utf-8")
};

app.use("/api/records", verifyTokenMiddleware, express.json(), RecordsRouter);

app.use("/api/auth", express.json(), AuthRouter);

app.use("/api/create", verifyTokenMiddleware, express.json(), CreateRouter);

app.use("/api/quiz", verifyTokenMiddleware, express.json(), QuizRouter);

app.use("/", (req, res) => {
    return res.end("Hello from Backend");
});

async function start(){
    try{
        await mongoose.connect(mongoURI);
        console.log("Соединение с базой данных успешно установлено");
        const server = https.createServer(httpsOptions, app);
        server.listen(PORT, HOST, () => {
            console.log(`Сервер работает на адресе: https://${HOST}:${PORT}`);
        });
    } catch (err){
        console.log(`Ошибка: ${err.message}`);
        process.exit(1);
    }
}

start();
