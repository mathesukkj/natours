import express from "express";
import {
    getAllTours,
    addNewTour,
    getTourById,
    updateTour,
    deleteTour,
    aliasBestTours,
    getTourStats,
} from "../controllers/tourController.js";

export const router = express.Router();

router.route("/").get(getAllTours).post(addNewTour);

router.route("/stats").get(getTourStats);

router.route("/best-cheap").get(aliasBestTours, getAllTours);

router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);
