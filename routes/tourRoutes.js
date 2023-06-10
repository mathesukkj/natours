import express from "express";
import {
    getAllTours,
    addNewTour,
    getTourById,
    updateTour,
    deleteTour,
    aliasBestTours,
    getTourStats,
    getMonthlyPlan,
} from "../controllers/tourController.js";
import { isAuthenticated } from "../controllers/authController.js";

export const router = express.Router();

router.route("/").get(isAuthenticated, getAllTours).post(addNewTour);

router.route("/stats").get(getTourStats);

router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/best-cheap").get(aliasBestTours, getAllTours);

router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);
