import { Test, TestingModule } from '@nestjs/testing';
import { SubjectSubdivisionStudentsController } from './subject-subdivision-students.controller';

describe('SubjectSubdivisionStudentsController', () => {
  let controller: SubjectSubdivisionStudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectSubdivisionStudentsController],
    }).compile();

    controller = module.get<SubjectSubdivisionStudentsController>(SubjectSubdivisionStudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
