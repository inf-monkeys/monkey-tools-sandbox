import { BaseReqDto } from '@/common/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class ArrayToStringDto extends BaseReqDto {
  @ApiProperty({
    description: 'Input Array',
    type: String,
    isArray: true,
    required: true,
  })
  @Joiful.array().required()
  inputData: string[];

  @ApiProperty({
    description: 'Delimiter',
    type: String,
    required: true,
    example: ',',
  })
  @Joiful.string().required()
  delimiter: string;
}
