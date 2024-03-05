import { ApiProperty } from '@nestjs/swagger';

export class RunCustomCodeRespDto {
  @ApiProperty({
    description: 'Result',
    type: Object,
    required: true,
  })
  data: any;
}
