import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeModule } from './modules/code/code.module';
import { ArrayToStringModule } from './modules/array_to_string/array_to_string.module';
import { ChatWithBaichuan2Module } from './modules/chat_with_baichuan2/chat_with_baichuan2.module';

@Module({
  imports: [CodeModule, ArrayToStringModule, ChatWithBaichuan2Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
