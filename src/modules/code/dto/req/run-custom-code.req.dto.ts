import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class RunCustomCodeDto {
  @ApiProperty({
    description: 'Source Code',
    type: String,
    required: true,
  })
  @Joiful.string().required()
  sourceCode: string;

  @ApiProperty({
    description: 'Function Parameters',
    type: Object,
    required: false,
  })
  @Joiful.object().optional()
  parameters: { [x: string]: any };
}
