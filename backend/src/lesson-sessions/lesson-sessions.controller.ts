import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { LessonSessionsService } from './lesson-sessions.service';

import { CreateLessonSessionDto } from './dto/create-lesson-session.dto';
import { CancelLessonDto } from './dto/cancel-lesson.dto';

@Controller('lesson-sessions')
export class LessonSessionsController {
  constructor(private readonly lessonSessionsService: LessonSessionsService) {}

  @Post()
  create(@Body() dto: CreateLessonSessionDto) {
    return this.lessonSessionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.lessonSessionsService.findAll();
  }

  @Get('date/:date')
  findByDate(@Param('date') date: string) {
    return this.lessonSessionsService.findByDate(date);
  }

  @Post('generate')
  generate(@Body() body: { date: string }) {
    return this.lessonSessionsService.generateForDate(new Date(body.date));
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseIntPipe) id: number,

    @Body() dto: CancelLessonDto,
  ) {
    return this.lessonSessionsService.cancel(id, dto);
  }
}
