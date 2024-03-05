import { Test, TestingModule } from '@nestjs/testing';
import { CollectDowhileOutputController } from './collect_dowhile_output.controller';

describe('CollectDowhileOutputController', () => {
  let controller: CollectDowhileOutputController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectDowhileOutputController],
    }).compile();

    controller = module.get<CollectDowhileOutputController>(
      CollectDowhileOutputController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
