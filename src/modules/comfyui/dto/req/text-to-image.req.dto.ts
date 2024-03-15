import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class ComfyuiTextToImageDto {
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

  @ApiProperty({
    type: Number,
    required: false,
  })
  @Joiful.number().optional()
  width?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @Joiful.number().optional()
  height?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @Joiful.number().required()
  batchCount: number;
}
