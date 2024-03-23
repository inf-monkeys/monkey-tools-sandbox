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
import { ChatgptWithPromptService } from './chatgpt_with_prompt.service';
import { ChatGptWithPromptDto } from './dto/req/chatgpt-with-prompt.req.dto';

@Controller('')
@UseGuards(new AuthGuard())
@ApiTags('文本生成')
export class ChatgptWithPromptController {
  constructor(private readonly service: ChatgptWithPromptService) {}

  @Post('/chatgpt-with-prompt')
  @ApiOperation({
    summary: '文本生成（GPT）',
    description: '使用 ChatGPT 生成文本',
  })
  @MonkeyToolName('chatgpt_with_prompt')
  @MonkeyToolCategories(['gen-text'])
  @MonkeyToolIcon('emoji:💬:#c15048')
  @MonkeyToolInput([
    {
      displayName: '系统消息（Prompt）',
      name: 'systemMessage',
      type: 'string',
      default: '',
      required: false,
    },
    {
      displayName: '用户消息',
      name: 'humanMessage',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: '大语言模型',
      name: 'modelType',
      type: 'options',
      default: 'gpt3',
      options: [
        {
          name: 'GPT-3.5 Turbo',
          value: 'gpt3',
        },
        {
          name: 'GPT-3.5 Turbo（16K 上下文）',
          value: 'gpt-3.5-turbo-16k',
        },
        {
          name: 'GPT-4 Turbo（128K 上下文）',
          value: 'gpt4',
        },
        {
          name: 'GPT-4（32K 上下文）',
          value: 'gpt-4-32k',
        },
      ],
      required: true,
    },
    {
      displayName: 'temperature（随机性程度）',
      name: 'temperature',
      type: 'number',
      default: 1,
      required: false,
      description:
        '填写 0-1 的浮点数\n用于生成文本时，模型输出的随机性程度。较高的温度会导致更多的随机性，可能产生更有创意的回应。而较低的温度会使模型的输出更加确定，更倾向于选择高概率的词语。',
    },
    {
      displayName: 'presence_penalty（重复惩罚）',
      name: 'presence_penalty',
      type: 'number',
      default: 0,
      required: false,
      description:
        '填写 0-1 的浮点数\n用于惩罚模型生成重复的词语，从而使生成的文本更加多样化。',
    },
    {
      displayName: 'frequency_penalty（频率惩罚）',
      name: 'frequency_penalty',
      type: 'number',
      default: 0,
      required: false,
      description:
        '填写 0-1 的浮点数\n用于惩罚模型生成低频词语，从而使生成的文本更加多样化。',
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'response',
      displayName: 'GPT 回复',
      type: 'string',
    },
  ])
  @MonkeyToolExtra({
    estimateTime: 10,
  })
  public async chatgptWithPrompt(@Body() body: ChatGptWithPromptDto) {
    const result = await this.service.chatGptWithPrompt(body);
    return result;
  }
}
