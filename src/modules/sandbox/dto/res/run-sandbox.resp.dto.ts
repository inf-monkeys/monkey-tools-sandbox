import { ApiProperty } from '@nestjs/swagger';

export class RunSandboxRespDto {
  @ApiProperty({
    description: 'stdout',
    type: String,
    required: true,
  })
  stdout: string;

  @ApiProperty({
    description: 'stderr',
    type: String,
    required: true,
  })
  stderr: string;

  @ApiProperty({
    description: 'output',
    type: String,
    required: true,
  })
  output: string;

  @ApiProperty({
    description: 'code',
    type: Number,
    required: true,
  })
  code: number;

  @ApiProperty({
    description: 'signal',
    type: String,
    required: true,
  })
  signal: string | null;
}
