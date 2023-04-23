import express from "express";
import { readFileSync } from "fs";

const app = express();
const tours = JSON.parse(readFileSync("./dev-data/data/tours-simple.json"));

app.get("/", (req, res) => {
    res.status(200).json({
        msg: "hi",
        app: "natours",
    });
});

app.get("/api/v1/tours", (req, res) => {
    res.status(200).send({
        status: "success",
        results: tours.length,
        data: {
            tours,
        },
    });
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});
