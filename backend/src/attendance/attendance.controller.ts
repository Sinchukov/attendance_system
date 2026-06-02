/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { AttendanceService } from './attendance.service';

import { CheckInDto } from './dto/check-in.dto';

import { UpdateAttendanceDto } from './dto/update-attendance.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  // HIKVISION ENTRYPOINT

  @Post('check-in')
  checkIn(@Body() dto: CheckInDto) {
    return this.attendanceService.checkIn(dto);
  }

  // ONLY TEACHERS & ADMINS

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  // ONLY TEACHERS & ADMINS

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  @Patch(':id')
  manualEdit(
    @Param('id', ParseIntPipe) id: number,

    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.manualEdit(id, dto);
  }

  @Get('history/:studentId')
  getStudentHistory(
    @Param('studentId', ParseIntPipe)
    studentId: number,
  ) {
    return this.attendanceService.getStudentHistory(studentId);
  }

  @Get('session-history/:sessionId')
  getSessionHistory(
    @Param('sessionId', ParseIntPipe)
    sessionId: number,
  ) {
    return this.attendanceService.getSessionHistory(sessionId);
  }
}
