export type AttendanceEventType =
  | "CHECK_IN_SUCCESS"
  | "CHECK_OUT_SUCCESS"
  | "DUPLICATE_CHECK_IN"
  | "DUPLICATE_CHECK_OUT"
  | "SPAM_DETECTED"
  | "NO_ACTIVE_SESSION"
  | "STUDENT_NOT_FOUND"
  | "DEVICE_NOT_FOUND"
  | "INVALID_SESSION";

export interface AttendanceAuditLog {
  id: number;

  cardNo: string;

  deviceSerial: string;

  eventType: AttendanceEventType;

  message?: string | null;

  createdAt: string;

  studentId?: number | null;

  lessonSessionId?: number | null;

  attendanceId?: number | null;

  deviceId?: number | null;
}