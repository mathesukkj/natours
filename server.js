import { config } from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";

process.on("uncaughtException", (err) => {
    console.log("\x1b[91mUNCAUGHT EXCEPTION!!");
    console.log(err.name, err.message);
    process.exit(1);
});

config({ path: ".\\config.env" });

const db = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
const mongooseSettings = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };

mongoose
    .connect(db, mongooseSettings)
    .then(() => console.log("\x1b[92mSuccessfully connected to database!\x1b[0m"));

const server = app.listen(process.env.PORT, () => {
    console.log("\x1b[36mListening on port 8000\x1b[0m");
});

process.on("unhandledRejection", (err) => {
    console.log("\x1b[91mUNHANDLED REJECTION!!");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
