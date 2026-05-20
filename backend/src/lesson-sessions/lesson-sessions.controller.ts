import { Body, Controller, Get, Post } from '@nestjs/common';

import { LessonSessionsService } from './lesson-sessions.service';

@Controller('lesson-sessions')
export class LessonSessionsController {
  constructor(private readonly lessonSessionsService: LessonSessionsService) {}

  @Post('generate')
  generate(@Body() body: { date: string }) {
    return this.lessonSessionsService.generateForDate(new Date(body.date));
  }

  @Get()
  findAll() {
    return this.lessonSessionsService.findAll();
  }
}
