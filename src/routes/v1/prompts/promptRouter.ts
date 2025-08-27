import express from "express";
import { getAllPrompts } from "../../../controllers/promptController";

const promptRouter = express.Router();

promptRouter.get("/", getAllPrompts);
export default promptRouter;
