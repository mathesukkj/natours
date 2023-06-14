import express from "express";
import morgan from "morgan";
import { router as tourRouter } from "./routes/tourRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import { rateLimit } from "express-rate-limit";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
    req.time = new Date().toISOString();
    next();
});

app.use(express.static("public/"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 reqs - 15 min
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
    const err = new AppError(`Route ${req.url} not found!`, 404);
    next(err);
});

app.use(globalErrorHandler);

export default app;
