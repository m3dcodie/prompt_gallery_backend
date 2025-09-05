import { Request, Response, NextFunction } from "express";
import { PromptModel } from "../models/promptModel";
import { createResponseService } from "../models/responseModel";
import { PromptTransactionService } from "../models/promptTransactionService";
import { PromptEntity, PromptRequest, responseType } from "../types/prompt";
import { responseLoad } from "../types/response";

class ResponseHandler {
  static send(res: Response, statusCode: number, message: string, data?: any) {
    res.status(statusCode).json({ statusCode, message, data });
  }
}

export class PromptController {
  constructor(
    private promptModel: PromptModel,
    private promptTransactionService: PromptTransactionService,
  ) {}

  async getAllPrompts(req: Request, res: Response, next: NextFunction) {
    try {
      const allPrompts: PromptEntity[] =
        await this.promptModel.getAllPromptsService();
      ResponseHandler.send(res, 200, "Getting all prompts", allPrompts);
    } catch (err) {
      next(err);
    }
  }

  async createPrompt(req: Request, res: Response, next: NextFunction) {
    const { title, prompt, user_id, model, temperature, top_p, top_k } =
      req.body;
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
      const response = await fetch("http://localhost:8000/", {
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
      });
      const data = (await response.json()) as responseLoad;
      console.log("data>>>", data);
      if (!data.output_text || typeof data.output_text.content !== "string") {
        return next(new Error("Invalid response from external API"));
      }
      // Use correct method for PromptModel

      /*
      const newPrompt =
        await this.promptModel.createPrompt(promptCreateRequest);
      */
      let safeTemperature = Math.min(
        0.99,
        Math.max(0, Number.parseFloat(data.output_text.temperature ?? "0")),
      );
      safeTemperature = Number(safeTemperature.toFixed(2));
      let safeTopP = Math.min(
        0.99,
        Math.max(0, Number.parseFloat(data.output_text.top_p ?? "0")),
      );
      safeTopP = Number(safeTopP.toFixed(2));
      /*
      const newResponse = await createResponseService({
        prompt_id: newPrompt.prompt_id,
        user_id: promptCreateRequest.user_id,
        content: data.output_text.content,
        temperature: safeTemperature,
        top_p: safeTopP,
        usage: JSON.stringify(data.output_text.usage),
      });
      prompt_id: newPrompt.prompt_id,
      */
      const responseData = {        
        user_id: promptCreateRequest.user_id,
        content: data.output_text.content,
        temperature: safeTemperature,
        top_p: safeTopP,
        usage: JSON.stringify(data.output_text.usage),
      };

      const promtResp = await this.promptTransactionService.createPromptAndResponse(
        promptCreateRequest,
        responseData,
      );

      const randomResponse: responseType = {
        prompt_id: promtResp.prompt_id,
        user_id: promtResp.user_id,
        response: { data: data.output_text.content },
      };
      ResponseHandler.send(
        res,
        201,
        "Prompt created successfully",
        randomResponse,
      );
    } catch (err) {
      next(err);
    }
  }

  async getPromptById(req: Request, res: Response, next: NextFunction) {
    try {
      const promptId = req.params.id;
      const prompt: PromptEntity =
        await this.promptModel.getPromptByIdService(promptId);
      ResponseHandler.send(res, 200, "prompt", prompt);
    } catch (err) {
      next(err);
    }
  }
}
