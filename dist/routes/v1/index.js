import express from "express";
import userRouter from "./users/userRoutes";
import promptRouter from "./prompts/promptRouter";
const v1 = express.Router();
v1.use("/user", userRouter);
v1.use("/prompt", promptRouter);
export default v1;
