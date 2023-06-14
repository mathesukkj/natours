import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "An user must have a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: [true, "This email is already in use!"],
        lowercase: true,
        validate: {
            message: "Please provide a valid email!",
            validator: function (val) {
                const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                return pattern.test(val);
            },
        },
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "An user must have a password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Confirm the password!"],
        validate: {
            message: "The passwords arent equal!",
            validator: function (val) {
                return this.password == this.passwordConfirm;
            },
        },
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user",
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 2000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({
        active: true,
    });
    next();
});

userSchema.methods.checkPassword = async (testPassword, userPassword) => {
    return await bcrypt.compare(testPassword, userPassword);
};

userSchema.methods.changedPassword = async function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha512").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 600_000;

    console.log(resetToken);
    console.log(this.passwordResetToken);

    return resetToken;
};

export const User = mongoose.model("User", userSchema);
