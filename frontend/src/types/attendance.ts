export type AttendanceStatus =
  | "PENDING"
  | "PRESENT"
  | "LATE"
  | "ABSENT"
  | "EXCUSED";

export interface Attendance {
  id: number;

  studentId: number;

  lessonSessionId: number;

  status: AttendanceStatus;

  checkIn?: string | null;

  comment?: string | null;

  isManualEdited: boolean;

  createdAt: string;
}