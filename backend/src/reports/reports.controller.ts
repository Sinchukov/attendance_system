import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ReportsService } from './reports.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'TEACHER')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('student/:id')
  getStudentReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.getStudentReport(id);
  }

  @Get('group/:id')
  getGroupReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.getGroupReport(id);
  }

  @Get('subject/:id')
  getSubjectReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.getSubjectReport(id);
  }

  @Get('session/:id')
  getSessionReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.getSessionReport(id);
  }

  @Get('teacher/:id')
  getTeacherReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.getTeacherReport(id);
  }
}
