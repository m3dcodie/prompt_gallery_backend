import express from "express";
import {
  getAllPrompts,
  createPrompt,
} from "../../../controllers/promptController";

const promptRouter = express.Router();

promptRouter.get("/", getAllPrompts);
promptRouter.post("/", createPrompt);
export default promptRouter;
