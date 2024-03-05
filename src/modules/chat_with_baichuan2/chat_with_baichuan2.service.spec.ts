import { Test, TestingModule } from '@nestjs/testing';
import { ChatWithBaichuan2Service } from './chat_with_baichuan2.service';

describe('ChatWithBaichuan2Service', () => {
  let service: ChatWithBaichuan2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatWithBaichuan2Service],
    }).compile();

    service = module.get<ChatWithBaichuan2Service>(ChatWithBaichuan2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
