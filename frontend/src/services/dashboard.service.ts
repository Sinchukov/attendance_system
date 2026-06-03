import { api } from "@/lib/api";

export const dashboardService = {
  async getOverview() {
    const { data } =
      await api.get("/dashboard/overview");

    return data;
  },

  async getTopGroups() {
    const { data } =
      await api.get("/dashboard/top-groups");

    return data;
  },

  async getTopTeachers() {
    const { data } =
      await api.get("/dashboard/top-teachers");

    return data;
  },

  async getRiskStudents() {
    const { data } =
      await api.get("/dashboard/risk-students");

    return data;
  },

  async getSubjects() {
    const { data } =
      await api.get("/dashboard/subjects");

    return data;
  },

  async getMonthly() {
    const { data } =
      await api.get("/dashboard/monthly");

    return data;
  },
};