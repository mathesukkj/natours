import express from "express";
import {
    getAllTours,
    addNewTour,
    getTourById,
    updateTour,
    deleteTour,
    checkBody,
} from "../controllers/tourController.js";

export const router = express.Router();

router.route("/").get(getAllTours).post(checkBody, addNewTour);

router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);
