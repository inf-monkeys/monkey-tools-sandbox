import {
  MonkeyToolCategories,
  MonkeyToolExtra,
  MonkeyToolIcon,
  MonkeyToolInput,
  MonkeyToolName,
  MonkeyToolOutput,
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatWithBaichuan2Service } from './chat_with_baichuan2.service';
import { ChatWithBaichuan2Dto } from './dto/req/chat-with-baichuan2.req.dto';

@Controller('')
@UseGuards(new AuthGuard())
@ApiTags('文本生成')
export class ChatWithBaichuan2Controller {
  constructor(private readonly service: ChatWithBaichuan2Service) {}

  @Post('/chat-with-baichuan2')
  @ApiOperation({
    summary: '文本生成（Baichuan2）',
    description: '使用 Baichuan2 生成文本',
  })
  @MonkeyToolName('chat_with_baichuan2')
  @MonkeyToolCategories(['gen-text'])
  @MonkeyToolIcon('emoji:💬:#c15048')
  @MonkeyToolInput([
    {
      displayName: '用户消息',
      name: 'text',
      type: 'string',
      default: '',
      required: false,
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'response',
      displayName: '回复',
      type: 'string',
    },
  ])
  @MonkeyToolExtra({
    estimateTime: 10,
  })
  public async chatWithBaichuan2(@Body() body: ChatWithBaichuan2Dto) {
    const { text } = body;
    const result = await this.service.chatWithBaichuan2(text);
    return result;
  }
}
