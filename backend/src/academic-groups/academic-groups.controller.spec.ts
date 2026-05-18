import { Test, TestingModule } from '@nestjs/testing';
import { AcademicGroupsController } from './academic-groups.controller';

describe('AcademicGroupsController', () => {
  let controller: AcademicGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademicGroupsController],
    }).compile();

    controller = module.get<AcademicGroupsController>(AcademicGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
