import { readFileSync, writeFile } from "fs";

const tours = JSON.parse(readFileSync("./dev-data/data/tours-simple.json"));

export const checkId = (req, res, next, val) => {
    const foundTour = tours.find((item) => item.id == val);
    if (!foundTour) {
        return res.status(404).send({
            message: "Invalid id",
        });
    }
    next();
};

export const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).send({
            message: "Invalid body",
        });
    }
    next();
};

export const getAllTours = (req, res) => {
    res.status(200).send({
        tours,
    });
};

export const addNewTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    writeFile("./dev-data/data/tours-simple.json", JSON.stringify(tours), () => {
        res.status(201).send({
            tour: newTour,
        });
    });
};

export const getTourById = (req, res) => {
    const { id } = req.params;
    const foundTour = tours.find((item) => item.id == id);

    res.status(200).send({
        tour: foundTour,
    });
};

export const updateTour = (req, res) => {
    const { id } = req.params;
    const foundTour = tours.find((item) => item.id == id);

    const updatedTour = { ...foundTour, ...req.body };
    const updatedTours = tours.map((tour) => (tour.id == id ? updatedTour : tour));

    writeFile("./dev-data/data/tours-simple.json", JSON.stringify(updatedTours), () => {
        res.status(200).send({
            tour: updatedTour,
        });
    });
};

export const deleteTour = (req, res) => {
    const { id } = req.params;

    const updatedTours = tours.filter((tour) => tour.id != id);

    writeFile("./dev-data/data/tours-simple.json", JSON.stringify(updatedTours), () => {
        res.status(204).send();
    });
};
