import { pool } from "../config/database";

const createUserTableQuery = async () => {
  try {
    const userTableQuery = `
      CREATE TABLE  IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,          -- Internal use (joins, FKs)
        user_uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(), -- External use (APIs, URLs)        
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
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
      CREATE TABLE  IF NOT EXISTS LLM_Model (
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
      CREATE TABLE  IF NOT EXISTS Prompt (
        prompt_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES "User"(id),
        title VARCHAR(200),
        description TEXT,
        content TEXT NOT NULL,
        created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, content)  -- Optional: Idempotency key
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
      CREATE TABLE  IF NOT EXISTS Response (
        response_id SERIAL PRIMARY KEY,
        prompt_id INT REFERENCES Prompt(prompt_id),
        model_id INT REFERENCES LLM_Model(model_id),
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

const createRatingTableQuery = async () => {
  try {
    const RatingTableQuery = `
      CREATE TABLE  IF NOT EXISTS Rating (
        rating_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES "User"(id),
        prompt_id INT REFERENCES Prompt(prompt_id),
        response_id INT REFERENCES Response(response_id),
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
      CREATE TABLE  IF NOT EXISTS Share  (
        share_id SERIAL PRIMARY KEY,
        prompt_id INT REFERENCES Prompt(prompt_id),
        user_id INT REFERENCES "User"(id),
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

const createCommentTableQuery = async () => {
  try {
    const CommentTableQuery = `
      CREATE TABLE  IF NOT EXISTS Comment  (
        comment_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES "User"(id),
        prompt_id INT REFERENCES Prompt(prompt_id),
        response_id INT REFERENCES Response(response_id),
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
      CREATE INDEX idx_prompt_user_id ON Prompt(user_id);
      CREATE INDEX idx_response_prompt_id ON Response(prompt_id);
      CREATE INDEX idx_response_model_id ON Response(model_id);
      CREATE INDEX idx_rating_prompt_id ON Rating(prompt_id);
      CREATE INDEX idx_rating_response_id ON Rating(response_id);
      CREATE INDEX idx_comment_prompt_id ON Comment(prompt_id);
      CREATE INDEX idx_comment_response_id ON Comment(response_id);
      CREATE INDEX idx_share_prompt_id ON Share(prompt_id);
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
};