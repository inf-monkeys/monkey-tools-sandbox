import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeModule } from './modules/code/code.module';
import { ArrayToStringModule } from './modules/array_to_string/array_to_string.module';
import { ChatWithBaichuan2Module } from './modules/chat_with_baichuan2/chat_with_baichuan2.module';
import { ChatgptWithPromptModule } from './modules/chatgpt_with_prompt/chatgpt_with_prompt.module';
import { CollectDowhileOutputModule } from './modules/collect_dowhile_output/collect_dowhile_output.module';

@Module({
  imports: [CodeModule, ArrayToStringModule, ChatWithBaichuan2Module, ChatgptWithPromptModule, CollectDowhileOutputModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
