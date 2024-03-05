import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class ChatGptWithPromptDto {
  @ApiProperty({
    description: 'System Message',
    required: false,
    type: String,
  })
  @Joiful.string().optional()
  systemMessage: string;

  @ApiProperty({
    description: 'Human Message',
    required: true,
    type: String,
  })
  @Joiful.string().required()
  humanMessage: string;

  @ApiProperty({
    description: 'Model Type',
    required: true,
    type: String,
  })
  @Joiful.string().required()
  modelType: string;

  @ApiProperty({
    description: 'temperature',
    required: true,
    type: Number,
  })
  @Joiful.number().optional()
  temperature?: number;

  @ApiProperty({
    description: 'presence_penalty',
    required: true,
    type: Number,
  })
  @Joiful.number().optional()
  presence_penalty?: number;

  @ApiProperty({
    description: 'frequency_penalty',
    required: true,
    type: Number,
  })
  @Joiful.number().optional()
  frequency_penalty?: number;
}
