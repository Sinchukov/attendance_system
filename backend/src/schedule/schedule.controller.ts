import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { ScheduleService } from './schedule.service';

import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // СОЗДАТЬ РАСПИСАНИЕ
  @Post()
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto);
  }

  // ВСЕ РАСПИСАНИЯ
  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  // РАСПИСАНИЕ ГРУППЫ
  @Get('group/:groupId')
  findByGroup(@Param('groupId') groupId: string) {
    return this.scheduleService.findByGroup(Number(groupId));
  }

  // РАСПИСАНИЕ ГРУППЫ НА ДЕНЬ
  @Get('group/:groupId/:weekday')
  findByGroupAndDay(
    @Param('groupId') groupId: string,

    @Param('weekday') weekday: string,
  ) {
    return this.scheduleService.findByGroupAndDay(Number(groupId), weekday);
  }
}
