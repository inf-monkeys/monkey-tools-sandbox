import { Module } from '@nestjs/common';
import { ComfyuiController } from './comfyui.controller';
import { ComfyuiService } from './comfyui.service';

@Module({
  providers: [ComfyuiService],
  controllers: [ComfyuiController],
})
export class ComfyuiModule {}
