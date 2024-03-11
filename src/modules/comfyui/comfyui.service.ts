import { config } from '@/common/config';
import { S3Helpers } from '@/common/s3';
import { ReqContext } from '@/common/typings/request';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as uuid from 'uuid';
import {
  ComfyuiImageToImageWorkerInput,
  ComfyuiRequirement,
  ComfyuiTextToImageWorkerInput,
} from './interface';

@Injectable()
export class ComfyuiService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = config.comfyui.baseUrl;
  }

  private async waitForResult(resultUrl: string, timeoutSecs: number) {
    let status: string;
    let result: any;
    const start = +new Date();
    while (true) {
      const { data: resData } = await axios.get(resultUrl, {
        baseURL: this.baseUrl,
      });
      status = resData.status;
      result = resData.data;
      if (status === 'COMPLETED') {
        break;
      } else if (status === 'FAILED') {
        throw new Error('Run Comfyui Failed');
      }

      if (+new Date() - start > timeoutSecs * 1000) {
        throw new Error(`Run Comfyui Timeout for ${timeoutSecs} seconds.`);
      }
    }
    return result;
  }

  public async imageToImage(
    input: ComfyuiImageToImageWorkerInput,
    context: ReqContext,
  ) {
    const { appId } = context;
    const {
      modelId,
      initImage,
      prompt,
      negativePrompt,
      samplingStep = 20,
      cfgScale = 0,
    } = input;
    const imagePath = uuid.v4() + '.png';

    const s3Helpers = new S3Helpers();
    let ext = 'ckpt';
    if (
      !(await s3Helpers.existsModel(
        `Stable-diffusion/${appId}/${modelId}.${ext}`,
      ))
    ) {
      ext = 'safetensors';
    } else if (
      !(await s3Helpers.existsModel(
        `Stable-diffusion/${appId}/${modelId}.${ext}`,
      ))
    ) {
      throw new Error('模型不存在');
    }

    // TODO: fix me, change Stable-diffusion path
    const modelUrl = await s3Helpers.getFileSignedUrl(
      `Stable-diffusion/${appId}/${modelId}.${ext}`,
      config.s3.modelBucketName,
    );
    const modelName = `${modelId}.${ext}`;
    const requirements: ComfyuiRequirement[] = [
      {
        url: modelUrl,
        filename: modelName,
        path: 'models/checkpoints',
      },
      {
        url: initImage,
        filename: imagePath,
        path: `input/`,
      },
    ];

    // Run ComfyUI
    const { data } = await axios.post(
      '/monkeys/image-to-image',
      {
        modelName,
        prompt,
        negativePrompt,
        samplingStep,
        cfgScale,
        imagePath,
        requirements,
      },
      {
        baseURL: this.baseUrl,
      },
    );
    const { __monkeyResultUrl } = data;
    if (!__monkeyResultUrl) {
      throw new Error('Not receive __monkeyResultUrl');
    }
    const result = await this.waitForResult(__monkeyResultUrl, 3600);
    return result;
  }

  public async textToImage(
    input: ComfyuiTextToImageWorkerInput,
    context: ReqContext,
  ) {
    const { appId } = context;
    const {
      modelId,
      prompt,
      negativePrompt,
      samplingStep = 20,
      cfgScale = 0,
      width,
      height,
      batchCount,
    } = input;
    const s3Helpers = new S3Helpers();
    let ext = 'ckpt';
    if (
      !(await s3Helpers.existsModel(
        `Stable-diffusion/${appId}/${modelId}.${ext}`,
      ))
    ) {
      ext = 'safetensors';
    } else if (
      !(await s3Helpers.existsModel(
        `Stable-diffusion/${appId}/${modelId}.${ext}`,
      ))
    ) {
      throw new Error('模型不存在');
    }

    // TODO: fix me, change Stable-diffusion path
    const modelUrl = await s3Helpers.getFileSignedUrl(
      `Stable-diffusion/${appId}/${modelId}.${ext}`,
      config.s3.modelBucketName,
    );
    const modelName = `${modelId}.${ext}`;
    const requirements: ComfyuiRequirement[] = [
      {
        url: modelUrl,
        filename: modelName,
        path: 'models/checkpoints',
      },
    ];

    // Run ComfyUI
    const { data } = await axios.post(
      '/monkeys/image-to-image',
      {
        modelName,
        prompt,
        negativePrompt,
        samplingStep,
        cfgScale,
        width,
        height,
        batchCount,
        requirements,
      },
      {
        baseURL: this.baseUrl,
      },
    );
    const { __monkeyResultUrl } = data;
    if (!__monkeyResultUrl) {
      throw new Error('Not receive __monkeyResultUrl');
    }
    const result = await this.waitForResult(__monkeyResultUrl, 3600);
    return result;
  }
}
