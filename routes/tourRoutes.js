import express from "express";
import {
    getAllTours,
    addNewTour,
    getTourById,
    updateTour,
    deleteTour,
    checkId,
} from "../controllers/tourController.js";

export const router = express.Router();

router.param("id", checkId);

router.route("/").get(getAllTours).post(addNewTour);

router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);
