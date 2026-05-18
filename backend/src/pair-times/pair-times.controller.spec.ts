import { Test, TestingModule } from '@nestjs/testing';
import { PairTimesController } from './pair-times.controller';

describe('PairTimesController', () => {
  let controller: PairTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PairTimesController],
    }).compile();

    controller = module.get<PairTimesController>(PairTimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
