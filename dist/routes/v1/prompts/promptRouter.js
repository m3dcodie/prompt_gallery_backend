import express from "express";
import { getAllPrompts, createPrompt, getPromptById } from "../../../controllers/promptController";
const promptRouter = express.Router();
promptRouter.get("/", getAllPrompts);
promptRouter.post("/", createPrompt);
promptRouter.get("/:id", getPromptById);
export default promptRouter;
