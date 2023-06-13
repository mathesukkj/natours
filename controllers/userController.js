import { User } from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllUsers = async (req, res) => {
    const users = await User.find();

    res.status(200).send({
        users,
    });
};

export const updateCurrentUser = catchAsync(async (req, res) => {
    const { name, email, password, passwordConfirm, photo } = req.body;
    if (password || passwordConfirm) {
        throw new AppError("You can't update your password here!", 400);
    }

    const data = {
        name,
        email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, data, {
        new: true,
        runValidators: true,
    });

    res.status(200).send({
        data: user,
    });
});

export const getUserById = (req, res) => {};

export const deleteUser = (req, res) => {};
