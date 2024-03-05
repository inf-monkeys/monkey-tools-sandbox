import { Test, TestingModule } from '@nestjs/testing';
import { ArrayToStringService } from './array_to_string.service';

describe('ArrayToStringService', () => {
  let service: ArrayToStringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArrayToStringService],
    }).compile();

    service = module.get<ArrayToStringService>(ArrayToStringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
