export interface ComfyuiImageToImageWorkerInput {
  modelId: string;
  initImage: string;
  prompt: string;
  negativePrompt: string;
  samplingStep: number;
  cfgScale: number;
}

export interface ComfyuiTextToImageWorkerInput {
  modelId: string;
  prompt: string;
  negativePrompt: string;
  samplingStep: number;
  cfgScale: number;
  width?: number;
  height?: number;
  batchCount: number;
}

export interface ComfyuiRequirement {
  url: string;
  filename: string;
  path: string;
}
