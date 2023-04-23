import express from "express";
import morgan from "morgan";
import { router as tourRouter } from "./routes/tourRoutes.js";
import { router as userRouter } from "./routes/userRoutes.js";

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

export default app;
