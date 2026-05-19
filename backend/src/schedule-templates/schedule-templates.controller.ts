import { Body, Controller, Get, Post } from '@nestjs/common';

import { ScheduleTemplatesService } from './schedule-templates.service';

import { CreateScheduleTemplateDto } from './dto/create-schedule-template.dto';

@Controller('schedule-templates')
export class ScheduleTemplatesController {
  constructor(
    private readonly scheduleTemplatesService: ScheduleTemplatesService,
  ) {}

  @Post()
  create(@Body() dto: CreateScheduleTemplateDto) {
    return this.scheduleTemplatesService.create(dto);
  }

  @Get()
  findAll() {
    return this.scheduleTemplatesService.findAll();
  }
}
