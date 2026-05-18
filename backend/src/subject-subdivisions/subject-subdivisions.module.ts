import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { SubjectSubdivisionsController } from './subject-subdivisions.controller';

import { SubjectSubdivisionsService } from './subject-subdivisions.service';

@Module({
  imports: [PrismaModule],

  controllers: [SubjectSubdivisionsController],

  providers: [SubjectSubdivisionsService],
})
export class SubjectSubdivisionsModule {}
