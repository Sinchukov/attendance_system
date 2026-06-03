import {api} from "@/lib/axios";

import { AdminKpi } from "@/types/admin-kpi";
import { AdminStatistics } from "@/types/admin-statistics";

export const AdminDashboardApi = {
  getStatistics() {
    return api.get<AdminStatistics>(
      "/admin-dashboard/statistics",
    );
  },

  getKpi() {
    return api.get<AdminKpi>(
      "/admin-dashboard/kpi",
    );
  },

  getAttendanceStatistics() {
    return api.get(
      "/admin-dashboard/attendance-statistics",
    );
  },

  getTopAbsentStudents() {
    return api.get(
      "/admin-dashboard/top-absent-students",
    );
  },

  getTopGroups() {
    return api.get(
      "/admin-dashboard/top-groups",
    );
  },

  getUpcomingSessions() {
    return api.get(
      "/admin-dashboard/upcoming-sessions",
    );
  },

  getAuditLogs() {
    return api.get(
      "/admin-dashboard/audit-logs",
    );
  },

  getAuditLog(id: number) {
    return api.get(
      `/admin-dashboard/audit-logs/${id}`,
    );
  },

  getUsers() {
    return api.get(
      "/admin-dashboard/users",
    );
  },

  getUser(id: number) {
    return api.get(
      `/admin-dashboard/users/${id}`,
    );
  },

  activateUser(id: number) {
    return api.patch(
      `/admin-dashboard/users/${id}/activate`,
    );
  },

  deactivateUser(id: number) {
    return api.patch(
      `/admin-dashboard/users/${id}/deactivate`,
    );
  },

  changePassword(
    userId: number,
    password: string,
  ) {
    return api.patch(
      `/admin-dashboard/users/${userId}/password`,
      {
        password,
      },
    );
  },

  getTeachers() {
    return api.get(
      "/admin-dashboard/teachers",
    );
  },

  getStudents() {
    return api.get(
      "/admin-dashboard/students",
    );
  },

  getGroups() {
    return api.get(
      "/admin-dashboard/groups",
    );
  },

  getSubjects() {
    return api.get(
      "/admin-dashboard/subjects",
    );
  },

  getRooms() {
    return api.get(
      "/admin-dashboard/rooms",
    );
  },

  getDevices() {
    return api.get(
      "/admin-dashboard/devices",
    );
  },

  getSchedule() {
    return api.get(
      "/admin-dashboard/schedule",
    );
  },
};