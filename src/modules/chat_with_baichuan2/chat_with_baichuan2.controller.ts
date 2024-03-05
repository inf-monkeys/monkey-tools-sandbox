import { Body, Controller, Post } from '@nestjs/common';
import { ApiExtension, ApiOperation } from '@nestjs/swagger';
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
  @ApiExtension('x-monkey-block-name', 'chat_with_baichuan2')
  @ApiExtension('x-monkey-block-categories', ['gen-text'])
  @ApiExtension('x-monkey-block-icon', 'emoji:💬:#c15048')
  @ApiExtension('x-monkey-block-input', [
    {
      displayName: '用户消息',
      name: 'text',
      type: 'string',
      default: '',
      required: false,
    },
  ])
  @ApiExtension('x-monkey-block-output', [
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
