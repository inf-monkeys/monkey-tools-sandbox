import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonMiddleware } from './common/middlewares/common.middleware';
import { ArrayToStringModule } from './modules/array_to_string/array_to_string.module';
import { ChatWithBaichuan2Module } from './modules/chat_with_baichuan2/chat_with_baichuan2.module';
import { ChatgptWithPromptModule } from './modules/chatgpt_with_prompt/chatgpt_with_prompt.module';
import { CodeModule } from './modules/code/code.module';
import { CollectDowhileOutputModule } from './modules/collect_dowhile_output/collect_dowhile_output.module';
import { DysmsModule } from './modules/dysms/dysms.module';

@Module({
  imports: [
    CodeModule,
    ArrayToStringModule,
    ChatWithBaichuan2Module,
    ChatgptWithPromptModule,
    CollectDowhileOutputModule,
    DysmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CommonMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
