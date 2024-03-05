import { Test, TestingModule } from '@nestjs/testing';
import { ChatgptWithPromptService } from './chatgpt_with_prompt.service';

describe('ChatgptWithPromptService', () => {
  let service: ChatgptWithPromptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatgptWithPromptService],
    }).compile();

    service = module.get<ChatgptWithPromptService>(ChatgptWithPromptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
