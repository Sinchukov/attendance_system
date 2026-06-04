import { api } from "../axios";

export const TeachersApi = {
  getAll() {
    return api.get("/admin-dashboard/teachers");
  },

  getTeacherSessions(teacherId: number) {
    return api.get(
      `/lesson-sessions/teacher/${teacherId}`
    );
  },

  getTeacherWeek(teacherId: number) {
    return api.get(
      `/lesson-sessions/teacher/${teacherId}/week`
    );
  },
};