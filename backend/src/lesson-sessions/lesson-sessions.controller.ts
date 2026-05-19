import { Controller, Get, Param, Post } from '@nestjs/common';

import { LessonSessionsService } from './lesson-sessions.service';

@Controller('lesson-sessions')
export class LessonSessionsController {
  constructor(private readonly lessonSessionsService: LessonSessionsService) {}

  @Post('generate/:date')
  generate(@Param('date') date: string) {
    return this.lessonSessionsService.generateForDate(new Date(date));
  }

  @Get()
  findAll() {
    return this.lessonSessionsService.findAll();
  }
}
