// promptTransactionService.ts
import { pool } from "../config/database";
import { PromptModel } from "./models/promptModel";
import { createResponseService } from "./models/responseModel";

export class PromptTransactionService {
  constructor(
    private promptModel: PromptModel,
    private responseModel: createResponseService
  ) {}

  async createPromptAndResponse(promptData, responseData) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const prompt = await this.promptModel.createPrompt(promptData, client);
      responseData.prompt_id = prompt.prompt_id;
      await this.responseModel(responseData, client);
      await client.query("COMMIT");
      return prompt;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}