/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, UseGuards } from '@nestjs/common';

import { TeacherDashboardService } from './teacher-dashboard.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';

import { Roles } from '../auth/roles.decorator';

import { CurrentUser } from '../auth/current-user.decorator';
import { Param, ParseIntPipe } from '@nestjs/common';

@Controller('teacher-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TEACHER')
export class TeacherDashboardController {
  constructor(
    private readonly teacherDashboardService: TeacherDashboardService,
  ) {}

  @Get('me')
  getTeacherInfo(
    @CurrentUser()
    user: any,
  ) {
    return this.teacherDashboardService.getTeacherInfo(user.userId);
  }

  @Get('schedule')
  getSchedule(
    @CurrentUser()
    user: any,
  ) {
    return this.teacherDashboardService.getSchedule(user.userId);
  }

  @Get('today')
  getTodaySessions(
    @CurrentUser()
    user: any,
  ) {
    return this.teacherDashboardService.getTodaySessions(user.userId);
  }

  @Get('groups')
  getGroups(
    @CurrentUser()
    user: any,
  ) {
    return this.teacherDashboardService.getGroups(user.userId);
  }

  @Get('groups/:groupId/students')
  getGroupStudents(
    @Param('groupId', ParseIntPipe)
    groupId: number,
  ) {
    return this.teacherDashboardService.getGroupStudents(groupId);
  }

  @Get('students/:studentId')
  getStudent(
    @Param('studentId', ParseIntPipe)
    studentId: number,
  ) {
    return this.teacherDashboardService.getStudent(studentId);
  }

  @Get('groups/:groupId/schedule')
  getGroupSchedule(
    @Param('groupId', ParseIntPipe)
    groupId: number,
  ) {
    return this.teacherDashboardService.getGroupSchedule(groupId);
  }

  @Get('groups/:groupId/statistics')
  getGroupStatistics(
    @Param('groupId', ParseIntPipe)
    groupId: number,
  ) {
    return this.teacherDashboardService.getGroupAttendanceStatistics(groupId);
  }
}
