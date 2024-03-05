import { Module } from '@nestjs/common';
import { ChatgptWithPromptController } from './chatgpt_with_prompt.controller';
import { ChatgptWithPromptService } from './chatgpt_with_prompt.service';

@Module({
  controllers: [ChatgptWithPromptController],
  providers: [ChatgptWithPromptService],
})
export class ChatgptWithPromptModule {}
