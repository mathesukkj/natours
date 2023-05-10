import mongoose from "mongoose";

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
    },
    passwordConfirm: {
        type: String,
        required: [true, "Confirm the password!"],
    },
});

export const User = mongoose.model("User", userSchema);
