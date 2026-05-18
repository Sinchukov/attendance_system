import { Module } from '@nestjs/common';

import { PairTimesController } from './pair-times.controller';
import { PairTimesService } from './pair-times.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [PairTimesController],

  providers: [PairTimesService],
})
export class PairTimesModule {}
