import { Module } from '@nestjs/common';
import { CollectDowhileOutputController } from './collect_dowhile_output.controller';
import { CollectDowhileOutputService } from './collect_dowhile_output.service';

@Module({
  controllers: [CollectDowhileOutputController],
  providers: [CollectDowhileOutputService]
})
export class CollectDowhileOutputModule {}
