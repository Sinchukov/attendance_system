import { Test, TestingModule } from '@nestjs/testing';
import { SubjectSubdivisionsService } from './subject-subdivisions.service';

describe('SubjectSubdivisionsService', () => {
  let service: SubjectSubdivisionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectSubdivisionsService],
    }).compile();

    service = module.get<SubjectSubdivisionsService>(SubjectSubdivisionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
