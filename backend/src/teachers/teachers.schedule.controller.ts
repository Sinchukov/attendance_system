import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersScheduleController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get(':id/schedule')
  getTeacherSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.getTeacherSchedule(id);
  }

  @Get(':id/today-sessions')
  getTodaySessions(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.getTodaySessions(id);
  }
}
