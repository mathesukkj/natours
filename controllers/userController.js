import { User } from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    const users = await User.find();

    res.status(200).send({
        users,
    });
};

export const getUserById = (req, res) => {};

export const updateUser = (req, res) => {};

export const deleteUser = (req, res) => {};
