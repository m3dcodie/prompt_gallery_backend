import { Request, Response, NextFunction } from "express";
import {
  getAllPromptsService,
  createPromptService,
  getPromptByIdService,
} from "../models/promptModel";

import { PromptEntity, PromptRequest } from "../types/prompt";
import { responses, responseType } from "../data/sampleResponses";

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
    fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: promptCreateRequest.content }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        const newPrompt = await createPromptService(promptCreateRequest);

        const randomResponse: responseType = {
          prompt_id: newPrompt.prompt_id,
          user_id: newPrompt.user_id,
          response: data,
        };

        handleResponse(res, 201, "Prompt created successfully", randomResponse);
      })
      .catch((error) => console.error("Error:", error));
  } catch (err) {
    next(err);
  }
};

export const getPromptById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const promptId = req.params.id;
    const prompt: PromptEntity = await getPromptByIdService(promptId);
    handleResponse(res, 200, "prompt", prompt);
  } catch (err) {
    next(err);
  }
};
