import { AttendanceStatus } from '@prisma/client';

import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';

export class UpdateAttendanceDto {
  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsOptional()
  @IsDateString()
  checkIn?: Date;

  @IsInt()
  teacherId!: number;
}
