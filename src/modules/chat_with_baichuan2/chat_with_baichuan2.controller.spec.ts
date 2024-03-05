import { Test, TestingModule } from '@nestjs/testing';
import { ChatWithBaichuan2Controller } from './chat_with_baichuan2.controller';

describe('ChatWithBaichuan2Controller', () => {
  let controller: ChatWithBaichuan2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatWithBaichuan2Controller],
    }).compile();

    controller = module.get<ChatWithBaichuan2Controller>(
      ChatWithBaichuan2Controller,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
