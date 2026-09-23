import { Test, TestingModule } from '@nestjs/testing';
import { LiveSchedulesController } from './live_schedules.controller';
import { LiveSchedulesService } from './live_schedules.service';

describe('LiveSchedulesController', () => {
  let controller: LiveSchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveSchedulesController],
      providers: [LiveSchedulesService],
    }).compile();

    controller = module.get<LiveSchedulesController>(LiveSchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
