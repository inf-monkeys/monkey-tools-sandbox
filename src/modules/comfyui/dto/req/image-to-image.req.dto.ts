import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class ComfyuiImageToImageDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @Joiful.string().required()
  comfyuiServerBaseUrl: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Joiful.string().required()
  modelId: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Joiful.string().required()
  initImage: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Joiful.string().required()
  prompt: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Joiful.string().required()
  negativePrompt: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @Joiful.number().required()
  samplingStep: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @Joiful.number().required()
  cfgScale: number;
}
