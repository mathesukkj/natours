import express from "express";
import morgan from "morgan";
import { router as tourRouter } from "./routes/tourRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import AppError from "./utils/appError.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
    req.time = new Date().toISOString();
    next();
});

app.use(express.static("public/"));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
    /* res.status(404).send({
        message: `Route ${req.url} not found!`,
    });
    next(); */

    const err = new AppError(`Route ${req.url} not found!`, 404);
    next(err);
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).send({
        message: err.message,
    });
});

export default app;
