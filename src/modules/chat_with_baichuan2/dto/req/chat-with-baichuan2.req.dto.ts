import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class ChatWithBaichuan2Dto {
  @ApiProperty({
    description: 'Text',
    required: true,
    type: String,
  })
  @Joiful.string().required()
  text: string;
}
