import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('top-groups')
  getTopGroups() {
    return this.dashboardService.getTopGroups();
  }

  @Get('top-teachers')
  getTopTeachers() {
    return this.dashboardService.getTopTeachers();
  }

  @Get('risk-students')
  getRiskStudents() {
    return this.dashboardService.getRiskStudents();
  }

  @Get('subjects')
  getSubjectsAnalytics() {
    return this.dashboardService.getSubjectsAnalytics();
  }

  @Get('monthly')
  getMonthlyAnalytics() {
    return this.dashboardService.getMonthlyAnalytics();
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
}
