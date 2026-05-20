import { Test, TestingModule } from '@nestjs/testing';
import { SubjectSubdivisionStudentsService } from './subject-subdivision-students.service';

describe('SubjectSubdivisionStudentsService', () => {
  let service: SubjectSubdivisionStudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectSubdivisionStudentsService],
    }).compile();

    service = module.get<SubjectSubdivisionStudentsService>(SubjectSubdivisionStudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
