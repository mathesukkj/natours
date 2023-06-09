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
import { signUp } from "../controllers/authController.js";

export const router = express.Router();

router.post("/signup", signUp);

router.param("id", checkId);

router.route("/").get(getAllUsers).post(checkBody, addNewUser);

router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
