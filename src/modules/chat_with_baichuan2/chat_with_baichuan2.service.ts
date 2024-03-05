import { config } from '@/common/config';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ChatWithBaichuan2Service {
  public async chatWithBaichuan2(text: string) {
    if (!config.baichuan2.baseUrl) {
      throw new Error('Missing config baichuan2.baseUrl');
    }
    if (!config.baichuan2.modelPath) {
      throw new Error('Missing config baichuan2.modelPath');
    }
    const { data } = await axios.post(
      `${config.baichuan2.baseUrl}/v1/completions`,
      {
        model: config.baichuan2.modelPath,
        prompt: text + '<reserved_107>',
        max_tokens: 1024,
        temperature: 0.3,
      },
    );
    const result = {
      response: (data['choices'] || [{}])[0]['text'],
      usage: data['usage'],
    };
    return result;
  }
}
