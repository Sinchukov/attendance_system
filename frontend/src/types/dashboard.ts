export interface DashboardStatistics {
  students: number;

  teachers: number;

  groups: number;

  subjects: number;

  todaySessions: number;

  todayAttendances: number;

  present: number;

  absent: number;

  late: number;
}

export interface AttendanceStatistics {
  present: number;

  absent: number;

  late: number;
}

export interface KpiDashboard {
  totalStudents: number;

  totalTeachers: number;

  totalAttendances: number;

  present: number;

  absent: number;

  late: number;

  attendancePercent: number;
}

export interface SystemActivity {
  students: number;

  teachers: number;

  sessions: number;

  attendances: number;

  attendanceLogs: number;
}