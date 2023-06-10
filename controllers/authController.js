import { User } from "../models/userModel.js";
import catchAsync from "./../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "./../utils/appError.js";
import { promisify } from "util";

const getToken = (id) => {
    const { JWT_SECRET: secret, JWT_EXPIRES_IN: expiresIn } = process.env;

    return jwt.sign({ id }, secret, { expiresIn });
};

export const signUp = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = await User.create({ name, email, password, passwordConfirm });

    const token = getToken(newUser._id);

    res.status(201).send({ token, data: newUser });
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError("Missing fields!", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    const isPasswordValid = user && (await user.checkPassword(password, user.password));

    if (!isPasswordValid) {
        throw new AppError("Wrong email or password", 401);
    }

    const token = getToken(user._id);
    res.status(200).send({
        token,
    });
});

export const isAuthenticated = catchAsync(async (req, res, next) => {
    const { authorization: auth } = req.headers;

    if (!auth || !auth.startsWith("Bearer ")) {
        throw new AppError("You aren't logged in!", 401);
    }

    const token = auth.split(" ")[1];
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new AppError("The user belonging to this token doesnt exist anymore.", 401);
    }

    if (await user.changedPassword(decoded.iat)) {
        throw new AppError("Password changed recently. Please login again", 401);
    }

    next();
});
