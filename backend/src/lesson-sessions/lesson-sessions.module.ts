import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';

import { LessonSessionsController } from './lesson-sessions.controller';
import { LessonSessionsService } from './lesson-sessions.service';

@Module({
  imports: [PrismaModule],

  controllers: [LessonSessionsController],

  providers: [LessonSessionsService],
})
export class LessonSessionsModule {}
