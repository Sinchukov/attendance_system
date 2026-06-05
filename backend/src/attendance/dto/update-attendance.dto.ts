import { AttendanceStatus } from '@prisma/client';

import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsDateString()
  checkIn?: Date;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsInt()
  teacherId!: number;
}
