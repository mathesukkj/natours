import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
import { forgotPassword, login, resetPassword, signUp } from "../controllers/authController.js";

export const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.route("/").get(getAllUsers);

router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
