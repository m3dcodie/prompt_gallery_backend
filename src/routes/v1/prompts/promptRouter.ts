import express from "express";
import { PromptController } from "../../../controllers/promptController";
import { PromptModel } from "../../../models/promptModel";
import { createResponseService } from "../../../models/responseModel";
import { PromptTransactionService } from "../../../models/promptTransactionService";

const promptRouter = express.Router();
const promptModel = new PromptModel();
const responseModel = createResponseService;
const promptTransactionService = new PromptTransactionService(
  promptModel,
  responseModel,
);
const promptController = new PromptController(
  promptModel,
  promptTransactionService,
);

promptRouter.get("/", (req, res, next) =>
  promptController.getAllPrompts(req, res, next),
);
promptRouter.post("/", (req, res, next) =>
  promptController.createPrompt(req, res, next),
);
promptRouter.get("/:id", (req, res, next) =>
  promptController.getPromptById(req, res, next),
);
export default promptRouter;
