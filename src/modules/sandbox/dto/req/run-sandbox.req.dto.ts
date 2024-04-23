import { BaseReqDto } from '@/common/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';
import { Language } from '../../sandbox.service';

export class RunSandboxDto extends BaseReqDto {
  @ApiProperty({
    description: 'Language',
    type: String,
    required: true,
  })
  @Joiful.string().required()
  language: Language;

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
