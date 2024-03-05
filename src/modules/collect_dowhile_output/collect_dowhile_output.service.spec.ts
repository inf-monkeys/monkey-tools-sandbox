import { Test, TestingModule } from '@nestjs/testing';
import { CollectDowhileOutputService } from './collect_dowhile_output.service';

describe('CollectDowhileOutputService', () => {
  let service: CollectDowhileOutputService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectDowhileOutputService],
    }).compile();

    service = module.get<CollectDowhileOutputService>(
      CollectDowhileOutputService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
