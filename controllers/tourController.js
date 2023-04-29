import { Tour } from "../models/tourModel.js";

export const getAllTours = async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const fields = ["page", "sort", "limit", "fields"];
        fields.forEach((item) => delete queryObj[item]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (w) => "$" + w);

        const query = Tour.find(JSON.parse(queryStr));

        const tours = await query;

        res.status(200).send({
            tours,
        });
    } catch (err) {
        res.status(404).send({
            message: err,
        });
    }
};

export const addNewTour = async (req, res) => {
    try {
        const tour = await Tour.create(req.body);

        res.status(201).send({
            tour,
        });
    } catch (err) {
        res.status(400).send({
            message: err,
        });
    }
};

export const getTourById = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await Tour.findById(id);
        res.status(200).send({
            tour,
        });
    } catch (err) {
        res.status(404).send({
            message: err,
        });
    }
};

export const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await Tour.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        res.status(200).send({
            tour,
        });
    } catch (err) {
        if (err.kind == "ObjectId") {
            res.status(404).send({
                message: err,
            });
        } else {
            res.status(400).send({
                message: err,
            });
        }
    }
};

export const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        await Tour.findByIdAndDelete(id);
        res.status(204).send();
    } catch (err) {
        res.status(404).send({
            message: err,
        });
    }
};
