import { readFileSync, writeFile } from "fs";

const users = JSON.parse(readFileSync("./dev-data/data/users.json"));

export const checkId = (req, res, next, val) => {
    const foundUser = users.find((item) => item._id == val);
    if (!foundUser) {
        return res.status(404).send({
            message: "Invalid id",
        });
    }
    next();
};

export const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Invalid body",
        });
    }
    next();
};

export const getAllUsers = (req, res) => {
    res.status(200).send({
        users,
    });
};

export const addNewUser = (req, res) => {
    const lastId = users[users.length - 1]._id.split("6fa");

    const newId = lastId[0] + (+lastId[1] + 1);
    const newUser = Object.assign({ _id: newId, active: true, role: "user" }, req.body);

    users.push(newUser);
    writeFile("./dev-data/data/users.json", JSON.stringify(users), () => {
        res.status(201).send({
            user: newUser,
        });
    });
};

export const getUserById = (req, res) => {
    const { id } = req.params;
    const foundUser = users.find((item) => item._id == id);

    res.status(200).send({
        user: foundUser,
    });
};

export const updateUser = (req, res) => {
    const { id } = req.params;
    const foundUser = users.find((user) => user._id == id);

    const updatedUser = { ...foundUser, ...req.body };
    const updatedUsers = users.map((user) => (user._id == id ? updatedUser : user));

    writeFile("./dev-data/data/users.json", JSON.stringify(updatedUsers), () => {
        res.status(200).send({
            user: updatedUser,
        });
    });
};

export const deleteUser = (req, res) => {
    const { id } = req.params;

    const updatedUsers = users.filter((user) => user._id != id);

    writeFile("./dev-data/data/users.json", JSON.stringify(updatedUsers), () => {
        res.status(204).send();
    });
};