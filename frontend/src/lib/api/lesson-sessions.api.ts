import {api} from "@/lib/axios";

export const LessonSessionsApi = {
  getAll() {
    return api.get("/lesson-sessions");
  },

  getByDate(date: string) {
    return api.get(
      `/lesson-sessions/date/${date}`,
    );
  },

  create(data: unknown) {
    return api.post(
      "/lesson-sessions",
      data,
    );
  },

  generate(date: string) {
    return api.post(
      "/lesson-sessions/generate",
      {
        date,
      },
    );
  },

  cancel(
    id: number,
    reason: string,
  ) {
    return api.patch(
      `/lesson-sessions/${id}/cancel`,
      {
        reason,
      },
    );
  },

  getStudents(sessionId: number) {
    return api.get(
      `/lesson-sessions/${sessionId}/students`,
    );
  },

  updateAttendance(
    attendanceId: number,
    data: {
      status: string;
      comment?: string;
    },
  ) {
    return api.patch(
      `/lesson-sessions/attendance/${attendanceId}`,
      data,
    );
  },

  getMySessions() {
    return api.get(
      "/lesson-sessions/my",
    );
  },

  getMyWeekSessions() {
    return api.get(
      "/lesson-sessions/my/week",
    );
  },

  getTeacherSessions(
    teacherId: number,
  ) {
    return api.get(
      `/lesson-sessions/teacher/${teacherId}`,
    );
  },

  getTeacherWeekSessions(
    teacherId: number,
  ) {
    return api.get(
      `/lesson-sessions/teacher/${teacherId}/week`,
    );
  },
};