import { Test, TestingModule } from '@nestjs/testing';
import { ChatgptWithPromptController } from './chatgpt_with_prompt.controller';

describe('ChatgptWithPromptController', () => {
  let controller: ChatgptWithPromptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatgptWithPromptController],
    }).compile();

    controller = module.get<ChatgptWithPromptController>(
      ChatgptWithPromptController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
