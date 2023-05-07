import { Tour } from "../models/tourModel.js";
import catchAsync from "../utils/catchAsync.js";
import { APIFeatures } from "./../utils/apiFeatures.js";
import AppError from "./../utils/appError.js";

export const aliasBestTours = async (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty,duration";
    next();
};

export const getAllTours = catchAsync(async (req, res) => {
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limit().paginate();
    const tours = await features.query;

    res.status(200).send({
        tours,
    });
});

export const addNewTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.create(req.body);

    res.status(201).send({
        tour,
    });
});

export const getTourById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
        return next(new AppError("This id doesn't exist!", 404));
    }

    res.status(200).send({
        tour,
    });
});

export const updateTour = catchAsync(async (req, res) => {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!tour) {
        return next(new AppError("This id doesn't exist!", 404));
    }

    res.status(200).send({
        tour,
    });
});

export const deleteTour = catchAsync(async (req, res) => {
    const { id } = req.params;
    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
        return next(new AppError("This id doesn't exist!", 404));
    }

    res.status(204).send();
});

export const getTourStats = catchAsync(async (req, res) => {
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
});

export const getMonthlyPlan = catchAsync(async (req, res) => {
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
});
