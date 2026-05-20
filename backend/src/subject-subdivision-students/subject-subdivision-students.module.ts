import { Module } from '@nestjs/common';

import { SubjectSubdivisionStudentsController } from './subject-subdivision-students.controller';
import { SubjectSubdivisionStudentsService } from './subject-subdivision-students.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SubjectSubdivisionStudentsController],
  providers: [SubjectSubdivisionStudentsService],
  imports: [PrismaModule],
})
export class SubjectSubdivisionStudentsModule {}
