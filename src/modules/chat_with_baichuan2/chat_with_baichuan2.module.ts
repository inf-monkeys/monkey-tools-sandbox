import { Module } from '@nestjs/common';
import { ChatWithBaichuan2Controller } from './chat_with_baichuan2.controller';
import { ChatWithBaichuan2Service } from './chat_with_baichuan2.service';

@Module({
  providers: [ChatWithBaichuan2Service],
  controllers: [ChatWithBaichuan2Controller],
})
export class ChatWithBaichuan2Module {}
