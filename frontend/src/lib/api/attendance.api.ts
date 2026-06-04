import { api } from "../axios";

export const AttendanceApi = {
  updateAttendance(
    attendanceId: number,
    status:
      | "PRESENT"
      | "ABSENT"
      | "LATE"
      | "PENDING",
    comment?: string
  ) {
    return api.patch(
      `/lesson-sessions/attendance/${attendanceId}`,
      {
        status,
        comment,
      }
    );
  },

  getAuditLogs() {
    return api.get(
      "/admin-dashboard/audit-logs"
    );
  },

  getRecentChanges() {
    return api.get(
      "/admin-dashboard/attendance-changes"
    );
  },

  getStatistics() {
    return api.get(
      "/admin-dashboard/attendance-statistics"
    );
  },
};