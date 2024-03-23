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
import { GoApiMidjourneyInput, MidjourneyService } from './midjourney.service';

@Controller('')
@UseGuards(new AuthGuard())
@ApiTags('图像生成')
export class MidjourneyController {
  constructor(private readonly service: MidjourneyService) {}

  @Post('/goapi-midjourney')
  @ApiOperation({
    summary: '文本生成图像（MJ）',
    description: '使用 MidJourney 图片生成',
  })
  @MonkeyToolName('goapi_midjourney')
  @MonkeyToolCategories(['gen-image'])
  @MonkeyToolIcon('emoji:📷:#98ae36')
  @MonkeyToolInput([
    {
      type: 'string',
      name: 'prompt',
      displayName: '关键词（提示词）',
      default: '',
      required: true,
    },
    {
      name: 'process_mode',
      type: 'options',
      displayName: '处理模式',
      default: 'relax',
      options: [
        {
          name: 'relax',
          value: 'relax',
        },
        {
          name: 'mixed',
          value: 'mixed',
        },
        {
          name: 'fast',
          value: 'fast',
        },
        {
          name: 'turbo',
          value: 'turbo',
        },
      ],
    },
    {
      name: 'aspect_ratio',
      type: 'string',
      displayName: 'Aspect ratio',
      default: '1:1',
    },
    {
      name: 'skip_prompt_check',
      type: 'boolean',
      displayName: '是否调过 Prompt 校验',
      default: false,
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'result',
      displayName: '图像 URL 列表',
      type: 'file',
      typeOptions: {
        multipleValues: true,
      },
    },
  ])
  @MonkeyToolExtra({
    estimateTime: 10,
  })
  public async generateImageByGoApi(@Body() body: GoApiMidjourneyInput) {
    const urls = await this.service.generateImageByGoApi(body);
    return {
      result: urls,
    };
  }
}
