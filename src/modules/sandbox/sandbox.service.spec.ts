import { Test, TestingModule } from '@nestjs/testing';
import assert from 'assert';
import { SandboxService } from './sandbox.service';

describe('CodeService', () => {
  let service: SandboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SandboxService],
    }).compile();

    service = module.get<SandboxService>(SandboxService);
    const data = await service.runInVM(
      'python',
      `
import sys
print(sys.argv[1])`,
      ['Hello', 'World'],
    );
    console.log(data);
    assert(data.success);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
