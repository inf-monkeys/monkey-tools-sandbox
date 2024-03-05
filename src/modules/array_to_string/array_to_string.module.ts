import { Module } from '@nestjs/common';
import { ArrayToStringController } from './array_to_string.controller';
import { ArrayToStringService } from './array_to_string.service';

@Module({
  controllers: [ArrayToStringController],
  providers: [ArrayToStringService],
})
export class ArrayToStringModule {}
