import { config } from '@/common/config';
import { logger } from '@/common/logger';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';
import { ChatGptWithPromptDto } from './dto/req/chatgpt-with-prompt.req.dto';
import { GenerateTextByChatGPTParams } from './interface';
import { getChatRequestTokenCount } from './tokenizer';

@Injectable()
export class ChatgptWithPromptService {
  public async generateTextByChatGPT(
    params: GenerateTextByChatGPTParams,
  ): Promise<string | null> {
    const {
      messages,
      model,
      temperature = 1,
      frequency_penalty = 0,
      presence_penalty = 0,
    } = params;
    const openai = new OpenAI({
      apiKey: config.openai.apiKey,
      baseURL: config.openai.baseUrl,
    });
    const answer = await openai.chat.completions.create(
      {
        messages,
        model,
        temperature,
        n: 1,
        presence_penalty,
        frequency_penalty,
        stream: false,
      },
      {
        headers: {
          responseType: 'json',
        },
      },
    );
    if (answer instanceof Error) {
      throw answer;
    }
    let response;
    try {
      response = (answer as ChatCompletion).choices[0].message.content;
    } catch {
      throw new Error('something went wrong');
    }
    return response;
  }

  public async chatGptWithPrompt(params: ChatGptWithPromptDto) {
    const {
      systemMessage,
      humanMessage,
      modelType,
      temperature = 1,
      frequency_penalty = 0,
      presence_penalty = 0,
    } = params;
    const modelMap: { [x: string]: any } = {
      gpt3: 'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k': 'gpt-3.5-turbo-16k',
      gpt4: 'gpt-4-1106',
      'gpt-4-32k': 'gpt-4-32k',
    };
    const model = modelMap[modelType] || 'gpt-3.5-turbo';
    const messages: ChatCompletionMessageParam[] = [];
    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage,
      });
    }
    messages.push({
      role: 'user',
      content: humanMessage,
    });
    const tokenCount = await getChatRequestTokenCount(messages);
    logger.info('chatgpt token count: ', tokenCount);
    const response = await this.generateTextByChatGPT({
      messages,
      model,
      temperature,
      presence_penalty,
      frequency_penalty,
    });
    return {
      response: response!,
      __tokenCount: tokenCount,
    };
  }
}
