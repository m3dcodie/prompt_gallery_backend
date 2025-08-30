export interface responseType {
  prompt_id: number;
  user_id: number;
  response: string;
}

export interface responseLoad {
  prompt_id: number;  
  content: string;
  temperature: string;
  top_p: string;
  usage: any;
}