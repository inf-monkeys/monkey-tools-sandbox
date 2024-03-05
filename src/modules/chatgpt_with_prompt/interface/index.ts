import { ChatCompletionMessageParam } from 'openai/resources';

export interface GenerateTextByChatGPTParams {
  messages: ChatCompletionMessageParam[];
  model: string;
  temperature?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}
