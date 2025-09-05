import { Request, Response, NextFunction } from "express";
import {
  getAllPromptsService,
  createPromptService,
  getPromptByIdService,
} from "../models/promptModel";
import { createResponseService } from "../models/responseModel";
import { PromptEntity, PromptRequest, responseType } from "../types/prompt";
import { responseLoad } from "../types/response";

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
  const { title, prompt, user_id, model, temperature, top_p, top_k } = req.body;
  const promptCreateRequest: PromptRequest = {
    user_id,
    title,
    content: prompt,
    model: model,
    temperature: temperature,
    top_p: top_p,
    top_k: top_k,
  };
  try {
    fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptCreateRequest.content,
        model: promptCreateRequest.model,
        temperature: String(promptCreateRequest.temperature),
        top_p: String(promptCreateRequest.top_p),
        top_k: String(promptCreateRequest.top_k),
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log("data>>>");
        console.log(data);
        // Defensive checks for output_text
        if (!data.output_text || typeof data.output_text.content !== "string") {
          return next(new Error("Invalid response from external API"));
        }
        
        const newPrompt = await createPromptService(promptCreateRequest);
        // Ensure temperature and top_p are decimals < 1 with precision 2
        let temperature = Math.min(
          0.99,
          Math.max(0, Number.parseFloat(data.output_text.temperature ?? "0"))
        );
        temperature = Number(temperature.toFixed(2));

        let top_p = Math.min(
          0.99,
          Math.max(0, Number.parseFloat(data.output_text.top_p ?? "0"))
        );
        top_p = Number(top_p.toFixed(2));

        const newResponse = await createResponseService({
          prompt_id: newPrompt.prompt_id,
          user_id: promptCreateRequest.user_id,
          content: data.output_text.content,
          temperature: temperature,
          top_p: top_p,
          usage: JSON.stringify(data.output_text.usage)
        });

        const randomResponse: responseType = {
          prompt_id: newPrompt.prompt_id,
          user_id: newPrompt.user_id,
          response: { data: data.output_text.content },
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
