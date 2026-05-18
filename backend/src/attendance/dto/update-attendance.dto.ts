import { AttendanceStatus } from '@prisma/client';

export class UpdateAttendanceDto {
  status!: AttendanceStatus;

  teacherId!: number;

  checkIn?: Date;

  checkOut?: Date;
}
