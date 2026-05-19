import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleTemplatesController } from './schedule-templates.controller';

describe('ScheduleTemplatesController', () => {
  let controller: ScheduleTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleTemplatesController],
    }).compile();

    controller = module.get<ScheduleTemplatesController>(ScheduleTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
