import express from "express";
import {
    getAllTours,
    addNewTour,
    getTourById,
    updateTour,
    deleteTour,
    aliasBestTours,
} from "../controllers/tourController.js";

export const router = express.Router();

router.route("/").get(getAllTours).post(addNewTour);

router.route("/best-cheap").get(aliasBestTours, getAllTours);

router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);
