import {
  MonkeyBlockCategories,
  MonkeyBlockIcon,
  MonkeyBlockInput,
  MonkeyBlockName,
  MonkeyBlockOutput,
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatgptWithPromptService } from './chatgpt_with_prompt.service';
import { ChatGptWithPromptDto } from './dto/req/chatgpt-with-prompt.req.dto';

@Controller('')
export class ChatgptWithPromptController {
  constructor(private readonly service: ChatgptWithPromptService) {}

  @Post('/chatgpt-with-prompt')
  @ApiOperation({
    summary: '文本生成（GPT）',
    description: '使用 ChatGPT 生成文本',
  })
  @MonkeyBlockName('chat_with_baichuan2')
  @MonkeyBlockCategories(['gen-text'])
  @MonkeyBlockIcon('emoji:💬:#c15048')
  @MonkeyBlockInput([
    {
      displayName: '用户消息',
      name: 'text',
      type: 'string',
      default: '',
      required: false,
    },
  ])
  @MonkeyBlockOutput([
    {
      name: 'response',
      displayName: '回复',
      type: 'string',
    },
  ])
  public async chatgptWithPrompt(@Body() body: ChatGptWithPromptDto) {
    const result = await this.service.chatGptWithPrompt(body);
    return result;
  }
}
