import { Test, TestingModule } from '@nestjs/testing';
import { CtagoriesController } from './ctagories.controller';
import { CtagoriesService } from './ctagories.service';

describe('CtagoriesController', () => {
  let controller: CtagoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CtagoriesController],
      providers: [CtagoriesService],
    }).compile();

    controller = module.get<CtagoriesController>(CtagoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
