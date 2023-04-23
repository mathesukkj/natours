import express from "express";
import { readFileSync, writeFile } from "fs";

const app = express();
app.use(express.json());

const tours = JSON.parse(readFileSync("./dev-data/data/tours-simple.json"));

app.get("/", (req, res) => {
    res.status(200).send({
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

app.get("/api/v1/tours/:id", (req, res) => {
    const { id } = req.params;
    const foundTour = tours.find((item) => item.id == id);

    if (!foundTour) {
        return res.status(404).send({
            status: "failed",
            message: "Invalid id",
        });
    }

    res.status(200).send({
        status: "success",
        data: {
            tour: foundTour,
        },
    });
});

app.patch("/api/v1/tours/:id", (req, res) => {
    const { id } = req.params;
    const foundTour = tours.find((item) => item.id == id);

    if (!foundTour) {
        return res.status(404).send({
            status: "failed",
            message: "Invalid id",
        });
    }

    const updatedTour = { ...foundTour, ...req.body };
    const updatedTours = tours.map((tour) => (tour.id === updatedTour.id ? updatedTour : tour));

    writeFile("./dev-data/data/tours-simple.json", JSON.stringify(updatedTours), () => {
        res.status(200).json({
            status: "success",
            data: {
                tour: updatedTour,
            },
        });
    });
});

app.post("/api/v1/tours", (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    writeFile("./dev-data/data/tours-simple.json", JSON.stringify(tours), () => {
        res.status(201).send({
            status: "success",
            data: {
                tour: newTour,
            },
        });
    });
});

app.delete("/api/v1/tours/:id", (req, res) => {
    const { id } = req.params;
    const foundTour = tours.find((item) => item.id == id);

    if (!foundTour) {
        return res.status(404).send({
            status: "failed",
            message: "Invalid id",
        });
    }

    const updatedTours = tours
        .map((tour) => {
            return tour.id == id ? null : tour;
        })
        .filter((tour) => tour != null);

    writeFile("./dev-data/data/tours-simple.json", JSON.stringify(updatedTours), () => {
        res.status(204).send();
    });
});

app.listen(8000, () => {
    console.log("Listening on port 8000");
});
