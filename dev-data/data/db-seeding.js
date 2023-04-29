import { config } from "dotenv";
config({ path: "./config.env" });
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { Tour } from "../../models/tourModel.js";

const db = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
const mongooseSettings = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };

mongoose.connect(db, mongooseSettings).then(() => console.log("connected!"));

const tours = JSON.parse(readFileSync(`./dev-data/data/tours-simple.json`, "utf-8"));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("data added to db");
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

const deleteData = async () => {
    try {
        await Tour.deleteMany({});
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] == "--import") {
    importData();
} else if (process.argv[2] == "--delete") {
    deleteData();
}
