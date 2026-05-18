import { Test, TestingModule } from '@nestjs/testing';
import { SubjectSubdivisionsController } from './subject-subdivisions.controller';

describe('SubjectSubdivisionsController', () => {
  let controller: SubjectSubdivisionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectSubdivisionsController],
    }).compile();

    controller = module.get<SubjectSubdivisionsController>(SubjectSubdivisionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
