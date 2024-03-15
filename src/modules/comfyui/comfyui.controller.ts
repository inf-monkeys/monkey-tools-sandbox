import {
  MonkeyToolCategories,
  MonkeyToolDescription,
  MonkeyToolDisplayName,
  MonkeyToolExtra,
  MonkeyToolIcon,
  MonkeyToolInput,
  MonkeyToolName,
  MonkeyToolOutput,
} from '@/common/decorators/monkey-block-api-extensions.decorator';
import { AuthGuard } from '@/common/guards/auth.guard';
import { IRequest } from '@/common/typings/request';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { RunCustomCodeRespDto } from '../code/dto/res/run-custom-code.resp.dto';
import { ComfyuiService } from './comfyui.service';
import { ComfyuiImageToImageDto } from './dto/req/image-to-image.req.dto';
import { ComfyuiTextToImageDto } from './dto/req/text-to-image.req.dto';

@Controller('/comfyui')
@UseGuards(new AuthGuard())
export class ComfyuiController {
  constructor(private readonly service: ComfyuiService) {}

  @Post('/image-to-image')
  @ApiOperation({
    summary: '图像生成图像（ComfyUI）',
    description: '通过给出的参数，进行图像生成',
  })
  @MonkeyToolDisplayName('图像生成图像（ComfyUI）')
  @MonkeyToolDescription('通过给出的参数，进行图像生成')
  @MonkeyToolName('comfyui_image_to_image')
  @MonkeyToolCategories(['gen-image'])
  @MonkeyToolIcon('emoji:📷:#98ae36')
  @MonkeyToolInput([
    {
      displayName: 'ComfyUI Server',
      name: 'comfyuiServerBaseUrl',
      type: 'string',
      typeOptions: {
        assetType: 'comfyui-server',
      },
      default: 'default',
      required: true,
    },
    {
      displayName: '模型 ID',
      name: 'modelId',
      type: 'string',
      typeOptions: {
        assetType: 'sd-model',
      },
      default: 'sd',
      required: true,
    },
    {
      displayName: '初始图片',
      name: 'initImage',
      type: 'file',
      default: '',
      required: true,
      typeOptions: {
        // 是否支持多文件上传
        multipleValues: false,
        // 文件类型限制，例如：'.jpg,.png,.gif'
        accept: '.jpg,.jpeg,.png,.webp',
        // 文件数量限制
        // multipleValues 为 false 时，下面两个的值不需要填，因为只能为 1
        minValue: 1,
        maxValue: 1,
        maxSize: 1024 * 1024 * 10,
      },
    },
    {
      displayName: '提示词',
      name: 'prompt',
      type: 'string',
      default: 'a man',
      required: true,
    },
    {
      displayName: '负面提示词',
      name: 'negativePrompt',
      type: 'string',
      default: 'watermark, text',
      required: true,
    },
    {
      displayName: '采样步数',
      name: 'samplingStep',
      type: 'number',
      default: 20,
      required: true,
      typeOptions: {
        minValue: 1,
        maxValue: 150,
      },
    },
    {
      displayName: '提示词引导强度',
      name: 'cfgScale',
      type: 'number',
      default: 8,
      required: true,
      typeOptions: {
        minValue: 1,
        maxValue: 30,
      },
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'images',
      displayName: '图像 URL 列表',
      type: 'string',
      typeOptions: {
        multipleValues: true,
      },
    },
  ])
  @MonkeyToolExtra({
    estimateTime: 30,
  })
  @ApiOkResponse({ type: RunCustomCodeRespDto })
  public async imageToImage(
    @Req() req: IRequest,
    @Body() body: ComfyuiImageToImageDto,
  ) {
    const {
      modelId,
      prompt,
      negativePrompt,
      samplingStep,
      cfgScale,
      initImage,
      comfyuiServerBaseUrl,
    } = body;
    const result = await this.service.imageToImage(
      comfyuiServerBaseUrl,
      {
        modelId,
        prompt,
        negativePrompt,
        samplingStep,
        cfgScale,
        initImage,
      },
      req.context,
    );
    return {
      data: result,
    };
  }

  @Post('/text-to-image')
  @ApiOperation({
    summary: '文本生成图像（ComfyUI）',
    description: '通过给出的参数，进行图像生成',
  })
  @MonkeyToolName('comfyui_text_to_image')
  @MonkeyToolCategories(['gen-image'])
  @MonkeyToolIcon('emoji:📷:#98ae36')
  @MonkeyToolInput([
    {
      displayName: 'ComfyUI Server',
      name: 'comfyuiServerBaseUrl',
      type: 'string',
      typeOptions: {
        assetType: 'comfyui-server',
      },
      default: 'default',
      required: true,
    },
    {
      displayName: '模型 ID',
      name: 'modelId',
      type: 'string',
      typeOptions: {
        assetType: 'sd-model',
      },
      default: 'sd',
      required: true,
    },
    {
      displayName: '提示词',
      name: 'prompt',
      type: 'string',
      default: 'a man',
      required: true,
    },
    {
      displayName: '负面提示词',
      name: 'negativePrompt',
      type: 'string',
      default: 'EasyNegative',
      required: true,
    },
    {
      displayName: '生成图片数量',
      name: 'batchCount',
      type: 'number',
      default: 1,
      required: true,
    },
    {
      displayName: '宽度',
      name: 'width',
      type: 'number',
      default: 512,
      required: true,
      typeOptions: {
        minValue: 1,
        maxValue: 2048,
      },
    },
    {
      displayName: '高度',
      name: 'height',
      type: 'number',
      default: 512,
      required: true,
      typeOptions: {
        minValue: 1,
        maxValue: 2048,
      },
    },
    {
      displayName: '采样步数',
      name: 'samplingStep',
      type: 'number',
      default: 20,
      required: true,
      typeOptions: {
        minValue: 1,
        maxValue: 150,
      },
    },
    {
      displayName: '提示词引导强度',
      name: 'cfgScale',
      type: 'number',
      default: 7,
      required: true,
      typeOptions: {
        minValue: 1,
        maxValue: 30,
      },
    },
  ])
  @MonkeyToolOutput([
    {
      name: 'images',
      displayName: '图像 URL 列表',
      type: 'string',
      typeOptions: {
        multipleValues: true,
      },
    },
  ])
  @MonkeyToolExtra({
    estimateTime: 30,
  })
  @ApiOkResponse({ type: RunCustomCodeRespDto })
  public async textToImage(
    @Req() req: IRequest,
    @Body() body: ComfyuiTextToImageDto,
  ) {
    const {
      modelId,
      prompt,
      negativePrompt,
      samplingStep,
      cfgScale,
      width,
      height,
      batchCount,
      comfyuiServerBaseUrl,
    } = body;
    const result = await this.service.textToImage(
      comfyuiServerBaseUrl,
      {
        modelId,
        prompt,
        negativePrompt,
        samplingStep,
        cfgScale,
        width,
        height,
        batchCount,
      },
      req.context,
    );
    return {
      data: result,
    };
  }
}
