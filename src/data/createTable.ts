import { pool } from "../config/database";

const createUserTableQuery = async () => {
  try {
    const userTableQuery = `
      CREATE TABLE  IF NOT EXISTS "users" (
        id SERIAL PRIMARY KEY,          -- Internal use (joins, FKs)
        user_uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(), -- External use (APIs, URLs)        
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        user_status BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,gi
        updatedAt  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(userTableQuery);
    console.log("Table userTableQuery created successfully");
  } catch (error) {
    console.error("Error creating User table:", error);
  }
}

const createLLMModelTableQuery = async () => {
  try {
    const LLMModelTableQuery = `
      CREATE TABLE  IF NOT EXISTS LLM_Models (
        model_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        provider VARCHAR(50),
        version VARCHAR(20),
        created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name, provider, version)  -- Optional: Idempotency key
      );
    `;
    await pool.query(LLMModelTableQuery);
    console.log("Table LLMModelTableQuery created successfully");
  } catch (error) {
    console.error("Error creating LLM_Model table:", error);
  }
}

const createPromptTableQuery = async () => {
  try {
    const PromptTableQuery = `
      CREATE TABLE  IF NOT EXISTS prompts (
        prompt_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES "users"(id),
        title VARCHAR(200),
        description TEXT,
        content TEXT NOT NULL,
        created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, content)  -- Optional: Idempotency key --need to remove, add model id
      );
    `;
    await pool.query(PromptTableQuery);
    console.log("Table PromptTableQuery created successfully");
  } catch (error) {
    console.error("Error creating Prompt table:", error);
  }
}

const createResponseTableQuery = async () => {
  try {
    const ResponseTableQuery = `
      CREATE TABLE  IF NOT EXISTS responses (
        response_id SERIAL PRIMARY KEY,
        prompt_id INT REFERENCES prompts(prompt_id),
       
        top_p DECIMAL(2, 2),
        temperature DECIMAL(2, 2),
        content TEXT NOT NULL,
        created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(ResponseTableQuery);
    console.log("Table ResponseTableQuery created successfully");
  } catch (error) {
    console.error("Error creating Response table:", error);
  }
}
/*
const updateResponseTableQuery = async () => {
  try {
    const ResponseTableQuery = `
      ALTER TABLE responses         
        ADD COLUMN top_p DECIMAL(2, 2),
        ADD COLUMN temperature DECIMAL(2, 2)
      ;
    `;
    await pool.query(ResponseTableQuery);
    console.log("Table ResponseTableQuery updated successfully");
  } catch (error) {
    console.error("Error updating Response table:", error);
  }
}

const updateResponseTableQuery = async () => {
  try {
    const ResponseTableQuery = `
      ALTER TABLE responses         
        ADD COLUMN usage  VARCHAR(200)
      ;
    `;
    await pool.query(ResponseTableQuery);
    console.log("Table ResponseTableQuery updated successfully");
  } catch (error) {
    console.error("Error updating Response table:", error);
  }
}
*/
const updatePromptTableQuery = async () => {
  try {
    const PromptTableQuery = `
      ALTER TABLE prompts         
        ADD COLUMN  model_id INT REFERENCES LLM_Models(model_id)        
      ;
    `;
    await pool.query(PromptTableQuery);
    console.log("Table PromptTableQuery updated successfully");
  } catch (error) {
    console.error("Error updating PromptTableQuery table:", error);
  }
}

//need favourite prompt
const createRatingTableQuery = async () => {
  try {
    const RatingTableQuery = `
      CREATE TABLE  IF NOT EXISTS ratings (
        rating_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES "users"(id),
        prompt_id INT REFERENCES prompts(prompt_id), --need to remove as response id is here
        response_id INT REFERENCES responses(response_id),
        score INT CHECK (score BETWEEN 1 AND 5),
        created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, prompt_id, response_id) -- Idempotency key
      );
    `;
    await pool.query(RatingTableQuery);
    console.log("Table RatingTableQuery created successfully");
  } catch (error) {
    console.error("Error creating Rating table:", error);
  }
}

const createShareTableQuery = async () => {
  try {
    const ShareTableQuery = `
      CREATE TABLE  IF NOT EXISTS shares  (
        share_id SERIAL PRIMARY KEY,
        prompt_id INT REFERENCES prompts(prompt_id),
        user_id INT REFERENCES "users"(id),
        link VARCHAR(500) UNIQUE,
        email VARCHAR(100),
        email_sent BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(ShareTableQuery);
    console.log("Table ShareTableQuery created successfully");
  } catch (error) {
    console.error("Error creating Rating table:", error);
  }
}
//comment on response or prompt?
const createCommentTableQuery = async () => {
  try {
    const CommentTableQuery = `
      CREATE TABLE  IF NOT EXISTS comments  (
        comment_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES "users"(id),
        prompt_id INT REFERENCES prompts(prompt_id), --need to remove this or response
        response_id INT REFERENCES responses(response_id),
        content TEXT NOT NULL,
        created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, prompt_id, response_id, content) -- Idempotency key
      );
    `;
    await pool.query(CommentTableQuery);
    console.log("Table CommentTableQuery created successfully");
  } catch (error) {
    console.error("Error creating Comment table:", error);
  }
}

const createIndexQuery = async () => {
  try {
    const IndexQuery = `      
      CREATE INDEX IF NOT EXISTS idx_prompt_user_id ON prompts(user_id);
      CREATE INDEX IF NOT EXISTS idx_response_prompt_id ON responses(prompt_id);
      CREATE INDEX IF NOT EXISTS idx_response_model_id ON responses(model_id);
      CREATE INDEX IF NOT EXISTS idx_rating_prompt_id ON ratings(prompt_id);
      CREATE INDEX IF NOT EXISTS idx_rating_response_id ON ratings(response_id);
      CREATE INDEX IF NOT EXISTS idx_comment_prompt_id ON comments(prompt_id);
      CREATE INDEX IF NOT EXISTS idx_comment_response_id ON comments(response_id);
      CREATE INDEX IF NOT EXISTS idx_share_prompt_id ON shares(prompt_id);
    `;
    await pool.query(IndexQuery);
    console.log("Table IndexQuery created successfully");
  } catch (error) {
    console.error("Error creating Index:", error);
  }
}

export const createTables = async () => {
  await createUserTableQuery();
  await createLLMModelTableQuery();
  await createPromptTableQuery();
  await createResponseTableQuery();
  await createRatingTableQuery();
  await createShareTableQuery();
  await createCommentTableQuery();
  await createIndexQuery();
  //await updatePromptTableQuery();
  //await updateResponseTableQuery();
};