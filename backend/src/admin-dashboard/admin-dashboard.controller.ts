import { Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { AdminDashboardService } from './admin-dashboard.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from '../auth/roles.guard';
import { Body } from '@nestjs/common';

import { ChangeUserPasswordDto } from './dto/change-user-password.dto';

import { Roles } from '../auth/roles.decorator';
import { Param, ParseIntPipe } from '@nestjs/common';
@Controller('admin-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('statistics')
  getStatistics() {
    return this.adminDashboardService.getStatistics();
  }

  @Get('attendance-statistics')
  getAttendanceStatistics() {
    return this.adminDashboardService.getAttendanceStatistics();
  }

  @Get('top-absent-students')
  getTopAbsentStudents() {
    return this.adminDashboardService.getTopAbsentStudents();
  }

  @Get('top-groups')
  getTopGroups() {
    return this.adminDashboardService.getTopGroups();
  }

  @Get('upcoming-sessions')
  getUpcomingSessions() {
    return this.adminDashboardService.getUpcomingSessions();
  }

  @Get('audit-logs')
  getAttendanceAuditLogs() {
    return this.adminDashboardService.getAttendanceAuditLogs();
  }

  @Get('audit-logs/:id')
  getAttendanceAuditLog(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.adminDashboardService.getAttendanceAuditLog(id);
  }

  @Get('users/:id')
  getUser(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.adminDashboardService.getUser(id);
  }

  @Get('system-activity')
  getSystemActivity() {
    return this.adminDashboardService.getSystemActivity();
  }

  @Get('teachers')
  getTeachers() {
    return this.adminDashboardService.getTeachers();
  }

  @Get('students')
  getStudents() {
    return this.adminDashboardService.getStudents();
  }
  @Get('kpi')
  getKpi() {
    return this.adminDashboardService.getKpiDashboard();
  }
  @Get('attendance-changes')
  getAttendanceChanges() {
    return this.adminDashboardService.getRecentAttendanceChanges();
  }

  @Get('users')
  getUsers() {
    return this.adminDashboardService.getAllUsers();
  }

  @Get('groups')
  getGroups() {
    return this.adminDashboardService.getGroups();
  }

  @Get('subjects')
  getSubjects() {
    return this.adminDashboardService.getSubjects();
  }

  @Get('rooms')
  getRooms() {
    return this.adminDashboardService.getRooms();
  }

  @Get('devices')
  getDevices() {
    return this.adminDashboardService.getDevices();
  }

  @Get('schedule')
  getSchedule() {
    return this.adminDashboardService.getFullSchedule();
  }
  @Patch('users/:userId/password')
  changePassword(
    @Param('userId', ParseIntPipe)
    userId: number,

    @Body()
    dto: ChangeUserPasswordDto,
  ) {
    return this.adminDashboardService.changeUserPassword(userId, dto.password);
  }

  @Patch('users/:id/deactivate')
  deactivateUser(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.adminDashboardService.deactivateUser(id);
  }

  @Patch('users/:id/activate')
  activateUser(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.adminDashboardService.activateUser(id);
  }
}
