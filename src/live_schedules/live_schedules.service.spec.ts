import { Test, TestingModule } from '@nestjs/testing';
import { LiveSchedulesService } from './live_schedules.service';

describe('LiveSchedulesService', () => {
  let service: LiveSchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveSchedulesService],
    }).compile();

    service = module.get<LiveSchedulesService>(LiveSchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
