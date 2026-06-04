import { Attendance } from "./attendance";
import { Device } from "./device";
import { Teacher } from "./teacher";

export interface AttendanceChangeLog {
  id: number;

  attendanceId: number;

  teacherId: number | null;

  deviceId: number | null;

  oldStatus: string | null;

  newStatus: string;

  action: string;

  details: string | null;

  createdAt: string;

  attendance?: Attendance;

  teacher?: Teacher;

  device?: Device;
}