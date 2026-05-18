import { Test, TestingModule } from '@nestjs/testing';
import { AcademicGroupsService } from './academic-groups.service';

describe('AcademicGroupsService', () => {
  let service: AcademicGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademicGroupsService],
    }).compile();

    service = module.get<AcademicGroupsService>(AcademicGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
