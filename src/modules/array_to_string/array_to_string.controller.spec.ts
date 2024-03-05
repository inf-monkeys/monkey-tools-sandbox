import { Test, TestingModule } from '@nestjs/testing';
import { ArrayToStringController } from './array_to_string.controller';

describe('ArrayToStringController', () => {
  let controller: ArrayToStringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArrayToStringController],
    }).compile();

    controller = module.get<ArrayToStringController>(ArrayToStringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
