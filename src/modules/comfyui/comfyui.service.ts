import { config } from '@/common/config';
import { logger } from '@/common/logger';
import { S3Helpers } from '@/common/s3';
import { ReqContext } from '@/common/typings/request';
import { sleep } from '@/common/utils';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import url from 'url';
import * as uuid from 'uuid';
import {
  ComfyuiImageToImageWorkerInput,
  ComfyuiRequirement,
  ComfyuiTextToImageWorkerInput,
} from './interface';

@Injectable()
export class ComfyuiService {
  constructor() {}

  private async waitForResult(
    baseUrl: string,
    resultUrl: string,
    timeoutSecs: number,
  ) {
    let status: string;
    let result: any;
    const start = +new Date();
    while (true) {
      const { data: resData } = await axios.get(resultUrl, {
        baseURL: baseUrl,
      });
      status = resData.status;
      result = resData.data;
      logger.info(
        `Check comfyui result: ${url.resolve(baseUrl, resultUrl)}, status=${status}`,
      );
      if (status === 'COMPLETED') {
        break;
      } else if (status === 'FAILED') {
        throw new Error('Run Comfyui Failed');
      }

      if (+new Date() - start > timeoutSecs * 1000) {
        throw new Error(`Run Comfyui Timeout for ${timeoutSecs} seconds.`);
      }
      await sleep(1000);
    }
    return result;
  }

  public async imageToImage(
    baseUrl: string,
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
    let modelOssPath: string;
    const ckptModel = `Stable-diffusion/${appId}/${modelId}.ckpt`;
    const safetensorsModel = `Stable-diffusion/${appId}/${modelId}.safetensors`;
    if (await s3Helpers.existsModel(ckptModel)) {
      modelOssPath = ckptModel;
    } else if (await s3Helpers.existsModel(safetensorsModel)) {
      modelOssPath = safetensorsModel;
    } else {
      throw new Error('模型不存在');
    }

    // TODO: fix me, change Stable-diffusion path
    const modelUrl = await s3Helpers.getFileSignedUrl(
      modelOssPath,
      config.s3.modelBucketName,
    );
    const modelName =
      modelOssPath.split('/')[modelOssPath.split('/').length - 1];
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
        baseURL: baseUrl,
      },
    );
    const { __monkeyResultUrl } = data;
    if (!__monkeyResultUrl) {
      throw new Error('Not receive __monkeyResultUrl');
    }
    const result = await this.waitForResult(baseUrl, __monkeyResultUrl, 3600);
    return result;
  }

  public async textToImage(
    baseUrl: string,
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
    let modelOssPath: string;
    const ckptModel = `Stable-diffusion/${appId}/${modelId}.ckpt`;
    const safetensorsModel = `Stable-diffusion/${appId}/${modelId}.safetensors`;
    if (await s3Helpers.existsModel(ckptModel)) {
      modelOssPath = ckptModel;
    } else if (await s3Helpers.existsModel(safetensorsModel)) {
      modelOssPath = safetensorsModel;
    } else {
      throw new Error('模型不存在');
    }

    // TODO: fix me, change Stable-diffusion path
    const modelUrl = await s3Helpers.getFileSignedUrl(
      modelOssPath,
      config.s3.modelBucketName,
    );
    const modelName =
      modelOssPath.split('/')[modelOssPath.split('/').length - 1];
    const requirements: ComfyuiRequirement[] = [
      {
        url: modelUrl,
        filename: modelName,
        path: 'models/checkpoints',
      },
    ];

    // Run ComfyUI
    const { data } = await axios.post(
      '/monkeys/text-to-image',
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
        baseURL: baseUrl,
      },
    );
    const { __monkeyResultUrl } = data;
    if (!__monkeyResultUrl) {
      throw new Error('Not receive __monkeyResultUrl');
    }
    const result = await this.waitForResult(baseUrl, __monkeyResultUrl, 3600);
    return result;
  }
}
