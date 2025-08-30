import { pool } from "../config/database";
import { PromptRequest, PromptEntity } from "../types/prompt";

export const getAllPromptsService = async () => {
  /*
  Acquire and Release Clients:
  const client = await pool.connect();
        try {
            const res = await client.query('SELECT * FROM your_table');
            console.log(res.rows);
        } finally {
            client.release(); // Always release the client back to the pool
        }

        import { Pool } from 'pg'
const pool = new Pool()
 
const client = await pool.connect()
 
try {
  await client.query('BEGIN')
  const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
  const res = await client.query(queryText, ['brianc'])
 
  const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
  const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
  await client.query(insertPhotoText, insertPhotoValues)
  await client.query('COMMIT')
} catch (e) {
  await client.query('ROLLBACK')
  throw e
} finally {
  client.release()
}
  */
  const result = await pool.query(
    "SELECT prompt_id, user_id,title,description, content FROM prompts",
  );
  return result.rows as PromptEntity[];
  // If you need to map fields, use:
  // return result.rows.map(row => ({
  //   prompt_id: row.prompt_id,
  //   user_id: row.user_id,
  //   title: row.title,
  //   description: row.description,
  //   content: row.content,
  // }));
};

export const getPromptByIdService = async (id: number) => {
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
      where
      prompts.prompt_id  = $1`,
    [id],
  );
  return result.rows[0];
};
export const createPromptService = async (
  promptCreateRequest: PromptRequest,
) => {
  const result = await pool.query(
    "INSERT INTO prompts (user_id,title, content) VALUES ($1, $2, $3) RETURNING *",
    [
      promptCreateRequest.user_id,
      promptCreateRequest.title,
      promptCreateRequest.content,
    ],
  );
  return result.rows[0];
};
export const updatePromptService = async (
  id: number,
  first_name: string,
  last_name: string,
) => {
  const result = await pool.query(
    "UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *",
    [first_name, last_name, id],
  );
  return result.rows[0];
};
export const deleteUsersService = async (id: number) => {
  const result = await pool.query(
    "UPDATE users SET user_status = FALSE, updatedAt = CURRENT_TIMESTAMP WHERE id = $1",
  );
  return true;
};
