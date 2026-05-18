import { Body, Controller, Post, Param, Patch } from '@nestjs/common';

import { AttendanceService } from './attendance.service';

import { CheckInDto } from './dto/check-in.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  checkIn(@Body() dto: CheckInDto) {
    return this.attendanceService.checkIn(dto);
  }

  @Patch(':id/manual-edit')
  manualEdit(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) {
    return this.attendanceService.manualEdit(Number(id), dto);
  }
}
