import { Test, TestingModule } from '@nestjs/testing';
import { DysmsController } from './dysms.controller';

describe('DysmsController', () => {
  let controller: DysmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DysmsController],
    }).compile();

    controller = module.get<DysmsController>(DysmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
