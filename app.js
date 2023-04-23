import express from "express";
import { readFileSync, writeFile } from "fs";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

const tours = JSON.parse(readFileSync("./dev-data/data/tours-simple.json"));

const getAllTours = (req, res) => {
    res.status(200).send({
        tours,
    });
};

const addNewTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    writeFile("./dev-data/data/tours-simple.json", JSON.stringify(tours), () => {
        res.status(201).send({
            tour: newTour,
        });
    });
};

const getTourById = (req, res) => {
    const { id } = req.params;
    const foundTour = tours.find((item) => item.id == id);

    if (!foundTour) {
        return res.status(404).send({
            message: "Invalid id",
        });
    }

    res.status(200).send({
        tour: foundTour,
    });
};

const updateTour = (req, res) => {
    const { id } = req.params;
    const foundTour = tours.find((item) => item.id == id);

    if (!foundTour) {
        return res.status(404).send({
            message: "Invalid id",
        });
    }

    const updatedTour = { ...foundTour, ...req.body };
    const updatedTours = tours.map((tour) => (tour.id == id ? updatedTour : tour));

    writeFile("./dev-data/data/tours-simple.json", JSON.stringify(updatedTours), () => {
        res.status(200).send({
            tour: updatedTour,
        });
    });
};

const deleteTour = (req, res) => {
    const { id } = req.params;
    const foundTour = tours.find((item) => item.id == id);

    if (!foundTour) {
        return res.status(404).send({
            message: "Invalid id",
        });
    }

    const updatedTours = tours.filter((tour) => tour.id != id);

    writeFile("./dev-data/data/tours-simple.json", JSON.stringify(updatedTours), () => {
        res.status(204).send();
    });
};

app.route("/api/v1/tours").get(getAllTours).post(addNewTour);

app.route("/api/v1/tours/:id").get(getTourById).patch(updateTour).delete(deleteTour);

app.listen(8000, () => {
    console.log("Listening on port 8000");
});
