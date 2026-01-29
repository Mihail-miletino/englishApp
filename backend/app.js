import express from "express";
import mongoose from "mongoose";
import config from "config";
import {AuthRouter} from "./routes/auth.routes.js";
import {CreateRouter} from "./routes/create.routes.js";
import {RecordsRouter} from "./routes/records.routes.js";
import {verifyTokenMiddleware} from "./middleware/verifyToken.middleware.js";

const app = express();

const HOST = config.get("HOST");
const PORT = config.get("PORT");
const mongoURI = config.get("mongoURI");

app.use("/api/records", verifyTokenMiddleware, express.json(), RecordsRouter);

app.use("/api/auth", express.json(), AuthRouter);

app.use("/api/create", verifyTokenMiddleware, express.json(), (req, res, next) => {
    next();
}, CreateRouter);

app.use("/", (req, res) => {
    return res.end("Hello from Backend");
});

async function start(){
    try{
        await mongoose.connect(mongoURI);
        console.log("Соединение с базой данных успешно установлено");
        app.listen(PORT, HOST, () => {
            console.log(`Сервер работает на адресе: http://${HOST}:${PORT}`);
        });
    } catch (err){
        console.log(`Ошибка: ${err.message}`);
        process.exit(1);
    }
}

start();
