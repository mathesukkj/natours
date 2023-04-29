import { config } from "dotenv";
config({ path: `./config.env` });
import app from "./app.js";
import mongoose from "mongoose";

const db = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
const mongooseSettings = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };

mongoose.connect(db, mongooseSettings).then(() => console.log("connected!"));

app.listen(process.env.PORT, () => {
    console.log("Listening on port 8000");
});
