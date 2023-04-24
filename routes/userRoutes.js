import express from "express";
import {
    getAllUsers,
    addNewUser,
    getUserById,
    updateUser,
    deleteUser,
    checkId,
    checkBody,
} from "../controllers/userController.js";

export const router = express.Router();

router.param("id", checkId);

router.route("/").get(getAllUsers).post(checkBody, addNewUser);

router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
