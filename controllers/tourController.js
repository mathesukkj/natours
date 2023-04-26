import { Tour } from "../models/tourModel.js";

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
        // tours,
    });
};

export const addNewTour = (req, res) => {
    res.status(201).send({
        // tour: newTour,
    });
};

export const getTourById = (req, res) => {
    const { id } = req.params;
    // const foundTour = tours.find((item) => item.id == id);

    res.status(200).send({
        // tour: foundTour,
    });
};

export const updateTour = (req, res) => {
    const { id } = req.params;
    // const foundTour = tours.find((item) => item.id == id);

    // const updatedTour = { ...foundTour, ...req.body };
    // const updatedTours = tours.map((tour) => (tour.id == id ? updatedTour : tour));

    res.status(200).send({
        // tour: updatedTour,
    });
};

export const deleteTour = (req, res) => {
    const { id } = req.params;

    // const updatedTours = tours.filter((tour) => tour.id != id);

    res.status(204).send();
};
