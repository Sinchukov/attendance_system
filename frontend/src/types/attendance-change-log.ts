import { AttendanceStatus } from "./attendance";

export interface AttendanceChangeLog {
  id: number;

  attendanceId: number;

  teacherId?: number | null;

  deviceId?: number | null;

  oldStatus?: AttendanceStatus | null;

  newStatus: AttendanceStatus;

  action: string;

  details?: string | null;

  createdAt: string;
}