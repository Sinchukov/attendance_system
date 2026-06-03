import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Query } from '@nestjs/common';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview(
    @Query()
    filter: DashboardFilterDto,
  ) {
    return this.dashboardService.getOverview(filter);
  }

  @Get('top-groups')
  getTopGroups(
    @Query()
    filter: DashboardFilterDto,
  ) {
    return this.dashboardService.getTopGroups(filter);
  }

  @Get('top-teachers')
  getTopTeachers(
    @Query()
    filter: DashboardFilterDto,
  ) {
    return this.dashboardService.getTopTeachers(filter);
  }

  @Get('risk-students')
  getRiskStudents(
    @Query()
    filter: DashboardFilterDto,
  ) {
    return this.dashboardService.getRiskStudents(filter);
  }

  @Get('subjects')
  getSubjectsAnalytics(
    @Query()
    filter: DashboardFilterDto,
  ) {
    return this.dashboardService.getSubjectsAnalytics(filter);
  }

  @Get('monthly')
  getMonthlyAnalytics(
    @Query()
    filter: DashboardFilterDto,
  ) {
    return this.dashboardService.getMonthlyAnalytics(filter);
  }

  @Get('late-statistics')
  getLateAnalytics() {
    return this.dashboardService.getLateAnalytics();
  }

  @Get('weekday-statistics')
  getWeekdayAnalytics() {
    return this.dashboardService.getWeekdayAnalytics();
  }

  @Get('top-absent-students')
  getTopAbsentStudents() {
    return this.dashboardService.getTopAbsentStudents();
  }
  @Get('attendance-changes')
  getAttendanceChangesStatistics() {
    return this.dashboardService.getAttendanceChangesStatistics();
  }
  @Get('teacher-modifications')
  getTeacherModificationRanking() {
    return this.dashboardService.getTeacherModificationRanking();
  }
  @Get('devices')
  getDeviceAnalytics() {
    return this.dashboardService.getDeviceAnalytics();
  }
  @Get('audit-statistics')
  getAttendanceAuditStatistics() {
    return this.dashboardService.getAttendanceAuditStatistics();
  }
  @Get('terminal-success-rate')
  getTerminalSuccessRate() {
    return this.dashboardService.getTerminalSuccessRate();
  }
  @Get('cancelled-lessons')
  getCancelledLessonsStatistics() {
    return this.dashboardService.getCancelledLessonsStatistics();
  }
}
