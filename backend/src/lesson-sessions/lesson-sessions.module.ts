import { Module } from '@nestjs/common';

import { LessonSessionsService } from './lesson-sessions.service';
import { LessonSessionsController } from './lesson-sessions.controller';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [LessonSessionsController],

  providers: [LessonSessionsService],
})
export class LessonSessionsModule {}
