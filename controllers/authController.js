import { User } from "../models/userModel.js";
import crypto from "crypto";
import catchAsync from "./../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "./../utils/appError.js";
import { promisify } from "util";
import sendEmail from "../utils/sendEmail.js";

const sendToken = (user, statusCode, res) => {
    const token = getToken(user._id);

    const response = statusCode == 201 ? { token, data: user } : { token };

    res.status(statusCode).send(response);
};

const getToken = (id) => {
    const { JWT_SECRET: secret, JWT_EXPIRES_IN: expiresIn } = process.env;

    return jwt.sign({ id }, secret, { expiresIn });
};

export const signUp = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = await User.create({ name, email, password, passwordConfirm });

    sendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError("Missing fields!", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    const isPasswordValid = user && (await user.checkPassword(password, user.password));

    if (!user.active) {
        user.active = true;
        await user.save({ validateBeforeSave: false });
    }

    if (!isPasswordValid) {
        throw new AppError("Wrong email or password", 401);
    }

    sendToken(user, 200, res);
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

    req.user = user;
    next();
});

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError("You do not have the sufficient permissions to do this.", 403);
        }
        next();
    };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        throw new AppError("There's no user with that email address!", 404);
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `http://${req.get("host")}/api/v1/users/reset-password/${resetToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for only 10 minutes)",
            message: `Submit a PATCH request to this ${resetURL} containing your new password + passwordConfirm!`,
        });

        res.status(200).send({
            message: "Email sent!",
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        throw new AppError("Unknown error while sending the email. Sorry!", 500);
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;

    const hashedToken = crypto.createHash("sha512").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new AppError("Invalid/Expired token!", 400);
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const { password, newPassword } = req.body;

    const isPasswordValid = await user.checkPassword(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Wrong password!", 401);
    }

    user.password = newPassword;
    user.passwordConfirm = newPassword;
    await user.save();

    sendToken(user, 200, res);
});
