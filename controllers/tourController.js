import { Tour } from "../models/tourModel.js";
import { APIFeatures } from "./../utils/apiFeatures.js";

export const aliasBestTours = async (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty,duration";
    next();
};

export const getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limit().paginate();
        const tours = await features.query;

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

export const getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: "$difficulty",
                    qtyTours: { $sum: 1 },
                    qtyRatings: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
            // {
            //     $match: { _id: { $ne: "easy" }  }
            // }
        ]);

        res.status(200).send({
            stats,
        });
    } catch (err) {
        res.status(404).send({
            message: err,
        });
    }
};

export const getMonthlyPlan = async (req, res) => {
    try {
        const year = +req.params.year;
        const plan = await Tour.aggregate([
            { $unwind: "$startDates" },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    qtyTourStarts: { $sum: 1 },
                    tours: { $push: "$name" },
                },
            },
            { $addFields: { month: "$_id" } },
            { $project: { _id: 0 } },
            { $sort: { qtyTourStarts: -1 } },
        ]);

        res.status(200).send({
            plan,
        });
    } catch (err) {
        res.status(404).send({
            message: err,
        });
    }
};
