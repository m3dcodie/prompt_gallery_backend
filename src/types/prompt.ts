export interface PromptRequest {
  user_id: number,
  title: string,
  description?: string,
  content: string
}

export interface PromptEntity {
  prompt_id: number,
  user_id: number,
  title: string,
  description?: string,
  content: string
}