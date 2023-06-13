import express from "express";
import {
    deactivateUser,
    getAllUsers,
    getUserById,
    updateCurrentUser,
} from "../controllers/userController.js";
import {
    forgotPassword,
    isAuthenticated,
    login,
    resetPassword,
    signUp,
    updatePassword,
} from "../controllers/authController.js";

export const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-password", isAuthenticated, updatePassword);
router.patch("/update-data", isAuthenticated, updateCurrentUser);
router.delete("/deactivate-account", isAuthenticated, deactivateUser);

router.route("/").get(getAllUsers);

router.route("/:id").get(getUserById);
