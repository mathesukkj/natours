import express from "express";
import { getAllUsers, addNewUser, getUserById, updateUser, deleteUser } from "../controllers/userController.js";

export const router = express.Router();

router.route("/").get(getAllUsers).post(addNewUser);

router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
