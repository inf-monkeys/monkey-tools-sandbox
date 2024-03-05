import { Module } from '@nestjs/common';
import { DysmsController } from './dysms.controller';
import { DysmsService } from './dysms.service';

@Module({
  controllers: [DysmsController],
  providers: [DysmsService],
})
export class DysmsModule {}
