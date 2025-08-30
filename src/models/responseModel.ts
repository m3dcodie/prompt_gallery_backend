import { pool } from "../config/database";
import { responseLoad } from "../types/response";

export const createResponseService = async (
  responseCreateRequest: responseLoad,
) => {
  const result = await pool.query(
    "INSERT INTO responses (prompt_id, content,temperature,top_p,usage) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      responseCreateRequest.prompt_id,      
      responseCreateRequest.content,
      responseCreateRequest.temperature,
      responseCreateRequest.top_p,
      responseCreateRequest.usage,
    ],
  );
  return result.rows[0];
};
