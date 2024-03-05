import { BaseReqDto } from '@/common/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class ChatWithBaichuan2Dto extends BaseReqDto {
  @ApiProperty({
    description: 'Text',
    required: true,
    type: String,
  })
  @Joiful.string().required()
  text: string;
}
