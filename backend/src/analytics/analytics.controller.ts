import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-groups')
  getTopGroups() {
    return this.analyticsService.getTopGroups();
  }

  @Get('top-teachers')
  getTopTeachers() {
    return this.analyticsService.getTopTeachers();
  }

  @Get('risk-students')
  getRiskStudents() {
    return this.analyticsService.getRiskStudents();
  }

  @Get('monthly-attendance')
  getMonthlyAttendance() {
    return this.analyticsService.getMonthlyAttendance();
  }
}
