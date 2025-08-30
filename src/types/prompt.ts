export interface PromptRequest {
  user_id: number,
  title: string,
  description?: string,
  content: string,
  model: string,
  temperature?: number,
  top_p?: number,
  top_k?: number
}

export interface PromptEntity {
  prompt_id: number,
  user_id: number,
  title: string,
  description?: string,
  content: string
}