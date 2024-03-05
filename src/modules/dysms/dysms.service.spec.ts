import { Test, TestingModule } from '@nestjs/testing';
import { DysmsService } from './dysms.service';

describe('DysmsService', () => {
  let service: DysmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DysmsService],
    }).compile();

    service = module.get<DysmsService>(DysmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
