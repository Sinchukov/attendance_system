/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { TeacherAttendanceService } from './teacher-attendance.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

import { UpdateAttendanceStatusDto } from './dto/update-attendance-status.dto';

import { UpdateAttendanceCommentDto } from './dto/update-attendance-comment.dto';

import { CurrentUser } from '../auth/current-user.decorator';

@Controller('teacher-attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TEACHER')
export class TeacherAttendanceController {
  constructor(
    private readonly teacherAttendanceService: TeacherAttendanceService,
  ) {}

  @Get('session/:sessionId')
  getSessionAttendance(
    @Param('sessionId', ParseIntPipe)
    sessionId: number,
  ) {
    return this.teacherAttendanceService.getSessionAttendance(sessionId);
  }

  @Get('student/:studentId')
  getStudentAttendance(
    @Param('studentId', ParseIntPipe)
    studentId: number,
  ) {
    return this.teacherAttendanceService.getStudentAttendance(studentId);
  }

  @Get('student-history/:studentId')
  getStudentHistory(
    @Param('studentId', ParseIntPipe)
    studentId: number,
  ) {
    return this.teacherAttendanceService.getStudentHistory(studentId);
  }

  @Get('session-history/:sessionId')
  getSessionHistory(
    @Param('sessionId', ParseIntPipe)
    sessionId: number,
  ) {
    return this.teacherAttendanceService.getSessionHistory(sessionId);
  }

  @Patch(':attendanceId/status')
  updateStatus(
    @Param('attendanceId', ParseIntPipe)
    attendanceId: number,

    @Body()
    dto: UpdateAttendanceStatusDto,

    @CurrentUser()
    user: any,
  ) {
    return this.teacherAttendanceService.updateStatus(
      attendanceId,
      dto,
      user.userId,
    );
  }

  @Patch(':attendanceId/comment')
  updateComment(
    @Param('attendanceId', ParseIntPipe)
    attendanceId: number,

    @Body()
    dto: UpdateAttendanceCommentDto,

    @CurrentUser()
    user: any,
  ) {
    return this.teacherAttendanceService.updateComment(
      attendanceId,
      dto,
      user.userId,
    );
  }
}
