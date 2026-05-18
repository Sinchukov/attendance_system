import { Test, TestingModule } from '@nestjs/testing';
import { PairTimesService } from './pair-times.service';

describe('PairTimesService', () => {
  let service: PairTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PairTimesService],
    }).compile();

    service = module.get<PairTimesService>(PairTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
