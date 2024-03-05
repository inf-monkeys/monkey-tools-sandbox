import { BaseReqDto } from '@/common/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import * as Joiful from 'joiful';

export class SendDysmsReqDto extends BaseReqDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @Joiful.string().required()
  signName: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Joiful.string().required()
  templateCode: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Joiful.string().required()
  templateParam: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Joiful.string().required()
  phoneNumbers: string;
}
