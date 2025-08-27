import { Request, Response, NextFunction } from "express";
import {
  getAllPromptsService,
  createPromptService,
} from "../models/promptModel";

import { PromptEntity, PromptRequest } from "../types/prompt";

const handleResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
) => {
  res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};

export const getAllPrompts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allPrompts: PromptEntity[] = await getAllPromptsService();
    handleResponse(res, 200, "Getting all prompts", allPrompts);
  } catch (err) {
    next(err);
  }
};

export const createPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, prompt, user_id } = req.body;
  const promptCreateRequest: PromptRequest = {
    user_id,
    title,
    content: prompt,
  };
  try {
    const newPrompt = await createPromptService(promptCreateRequest);
    handleResponse(res, 201, "Prompt created successfully", newPrompt);
  } catch (err) {
    next(err);
  }
};
