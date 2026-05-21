import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Response } from 'express';

import { ReportsService } from './reports.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'TEACHER')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  // =========================================
  // STUDENT REPORT
  // =========================================

  @Get('student/:id')
  getStudentReport(
    @Param('id', ParseIntPipe)
    id: number,

    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.getStudentReport(id, from, to);
  }

  // =========================================
  // GROUP REPORT
  // =========================================

  @Get('group/:id')
  getGroupReport(
    @Param('id', ParseIntPipe)
    id: number,

    @Query() paginationDto: PaginationDto,

    @Query('from') from?: string,

    @Query('to') to?: string,
  ) {
    return this.reportsService.getGroupReport(id, paginationDto, from, to);
  }

  // =========================================
  // SUBJECT REPORT
  // =========================================

  @Get('subject/:id')
  getSubjectReport(
    @Param('id', ParseIntPipe)
    id: number,

    @Query() paginationDto: PaginationDto,

    @Query('from') from?: string,

    @Query('to') to?: string,
  ) {
    return this.reportsService.getSubjectReport(id, paginationDto, from, to);
  }
  // =========================================
  // SESSION REPORT
  // =========================================

  @Get('session/:id')
  getSessionReport(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.reportsService.getSessionReport(id);
  }

  // =========================================
  // TEACHER REPORT
  // =========================================

  @Get('teacher/:id')
  getTeacherReport(
    @Param('id', ParseIntPipe)
    id: number,

    @Query() paginationDto: PaginationDto,

    @Query('from') from?: string,

    @Query('to') to?: string,
  ) {
    return this.reportsService.getTeacherReport(id, paginationDto, from, to);
  }

  // =========================================
  // STUDENT STATS
  // =========================================

  @Get('student/:id/stats')
  getStudentStats(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.reportsService.getStudentStats(id);
  }

  // =========================================
  // EXCEL EXPORT
  // =========================================

  @Get('group/:id/excel')
  async exportGroupExcel(
    @Param('id', ParseIntPipe)
    id: number,

    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.exportGroupReportToExcel(id);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=group-${id}.xlsx`,
    );

    res.send(buffer);
  }
}
