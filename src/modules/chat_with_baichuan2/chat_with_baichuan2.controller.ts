import {
  MonkeyBlockCategories,
  MonkeyBlockIcon,
  MonkeyBlockInput,
  MonkeyBlockName,
  MonkeyBlockOutput,
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ChatWithBaichuan2Service } from './chat_with_baichuan2.service';
import { ChatWithBaichuan2Dto } from './dto/req/chat-with-baichuan2.req.dto';

@Controller('')
export class ChatWithBaichuan2Controller {
  constructor(private readonly service: ChatWithBaichuan2Service) {}

  @Post('/chat-with-baichuan2')
  @ApiOperation({
    summary: '文本生成（Baichuan2）',
    description: '使用 Baichuan2 生成文本',
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
  public async chatWithBaichuan2(@Body() body: ChatWithBaichuan2Dto) {
    const { text } = body;
    const result = await this.service.chatWithBaichuan2(text);
    return result;
  }
}
