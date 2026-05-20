import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { CreateScheduleTemplateDto } from './dto/create-schedule-template.dto';
import { ScheduleTemplatesService } from './schedule-templates.service';

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

  @Get('group/:groupId')
  findByGroup(
    @Param('groupId', ParseIntPipe)
    groupId: number,
  ) {
    return this.scheduleTemplatesService.findByGroup(groupId);
  }
}
