
import { pool } from "../config/database";
import { PromptRequest, PromptEntity } from "../types/prompt";

export interface IPromptModel {
  getAllPrompts(): Promise<PromptEntity[]>;
  getPromptById(id: number): Promise<PromptEntity | undefined>;
  createPrompt(promptCreateRequest: PromptRequest): Promise<PromptEntity>;
  updatePrompt(id: number, first_name: string, last_name: string): Promise<any>;
  deleteUser(id: number): Promise<boolean>;
}

export class PromptModel implements IPromptModel {
  async getAllPrompts(): Promise<PromptEntity[]> {
    const result = await pool.query(
      "SELECT prompt_id, user_id, title, description, content FROM prompts"
    );
    return result.rows as PromptEntity[];
  }

  async getPromptById(id: number): Promise<PromptEntity | undefined> {
    const result = await pool.query(
      `SELECT
        prompts.prompt_id,
        user_id,
        title,
        prompts.content,
        response_id,
        model_id,
        responses.content as response
      FROM prompts
      LEFT OUTER JOIN responses ON prompts.prompt_id = responses.prompt_id
      WHERE prompts.prompt_id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async createPrompt(promptCreateRequest: PromptRequest): Promise<PromptEntity> {
    const result = await pool.query(
      "INSERT INTO prompts (user_id, title, content, model_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        promptCreateRequest.user_id,
        promptCreateRequest.title,
        promptCreateRequest.content,
        promptCreateRequest.model,
      ]
    );
    return result.rows[0];
  }

  async updatePrompt(id: number, first_name: string, last_name: string): Promise<any> {
    const result = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *",
      [first_name, last_name, id]
    );
    return result.rows[0];
  }

  async deleteUser(id: number): Promise<boolean> {
    await pool.query(
      "UPDATE users SET user_status = FALSE, updatedAt = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );
    return true;
  }
}
