import express from "express";
import {
    getAllUsers,
    addNewUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/userController.js";
import { login, signUp } from "../controllers/authController.js";

export const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

router.route("/").get(getAllUsers);

router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
