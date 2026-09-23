import { Test, TestingModule } from '@nestjs/testing';
import { CtagoriesService } from './ctagories.service';

describe('CtagoriesService', () => {
  let service: CtagoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CtagoriesService],
    }).compile();

    service = module.get<CtagoriesService>(CtagoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
