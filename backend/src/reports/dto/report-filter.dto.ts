import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';

import { AttendanceStatus } from '@prisma/client';

export class ReportFilterDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsInt()
  groupId?: number;

  @IsOptional()
  @IsInt()
  subjectId?: number;

  @IsOptional()
  @IsInt()
  studentId?: number;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;
}
