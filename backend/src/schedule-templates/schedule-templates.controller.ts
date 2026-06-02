import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CreateScheduleTemplateDto } from './dto/create-schedule-template.dto';

import { ScheduleTemplatesService } from './schedule-templates.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

@Controller('schedule-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleTemplatesController {
  constructor(
    private readonly scheduleTemplatesService: ScheduleTemplatesService,
  ) {}

  @Post()
  @Roles('ADMIN')
  create(
    @Body()
    dto: CreateScheduleTemplateDto,
  ) {
    return this.scheduleTemplatesService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'TEACHER')
  findAll() {
    return this.scheduleTemplatesService.findAll();
  }

  @Get('group/:groupId')
  @Roles('ADMIN', 'TEACHER')
  findByGroup(
    @Param('groupId', ParseIntPipe)
    groupId: number,
  ) {
    return this.scheduleTemplatesService.findByGroup(groupId);
  }
}
