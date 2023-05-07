import AppError from "../utils/appError.js";

const handleCastError = (err) => {
    const msg = `Invalid ${err.path}: ${err.value}`;
    return new AppError(msg, 400);
};

const handleDuplicateFields = (err) => {
    const msg = `Duplicate field value: ${err.keyValue.name}. Use another value!`;
    return new AppError(msg, 400);
};

const sendErrorDev = (err, res) => {
    // if error happened in dev, show every info possible
    res.status(err.statusCode).send({
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // if error happened in prod, show as little info as possible
    if (err.isOperational) {
        res.status(err.statusCode).send({
            message: err.message,
        });
    } else {
        console.log("UNKNOWN ERROR: ", err);
        res.status(500).send({
            message: "Something went wrong!",
        });
    }
};

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        if (error.kind == "ObjectId") error = handleCastError(error);
        if (error.code === 11000) error = handleDuplicateFields(error);
        sendErrorProd(error, res);
    }
};
