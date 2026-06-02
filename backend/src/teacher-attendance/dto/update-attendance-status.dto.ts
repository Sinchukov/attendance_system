import { AttendanceStatus } from '@prisma/client';

export class UpdateAttendanceStatusDto {
  status!: AttendanceStatus;
}
