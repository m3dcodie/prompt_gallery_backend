export interface responseType {
  prompt_id: number;
  user_id: number;
  response: string;
}

export const responses: responseType[] = [
  {
    prompt_id: 1,
    user_id: 1,
    response: "This is a sample response for prompt 1 by user 1.",
  },
  {
    prompt_id: 2,
    user_id: 2,
    response: "This is a sample response for prompt 2 by user 2.",
  },
];
