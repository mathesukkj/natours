import { config } from "dotenv";
config({ path: "./config.env" });
import app from "./app.js";
import mongoose from "mongoose";

const db = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
const mongooseSettings = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };

mongoose.connect(db, mongooseSettings).then(() => console.log("connected!"));

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"],
    },
});
const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
    name: "The Park Camper",
    price: 376,
});
testTour
    .save()
    .then((data) => {
        console.log(data);
    })
    .catch((e) => {
        console.log("error when saving to db: " + e);
    });

app.listen(process.env.PORT, () => {
    console.log("Listening on port 8000");
});
