import { api } from "../axios";

import { AdminKpi } from "@/types/admin-kpi";

import { AdminStatistics } from "@/types/admin-statistics";

export async function getKpi(): Promise<AdminKpi> {
  const response = await api.get(
    "/admin-dashboard/kpi",
  );

  return response.data;
}

export async function getStatistics(): Promise<AdminStatistics> {
  const response = await api.get(
    "/admin-dashboard/statistics",
  );

  return response.data;
}

export async function getUsers() {
  const response = await api.get(
    "/admin-dashboard/users",
  );

  return response.data;
}

export async function getTeachers() {
  const response = await api.get(
    "/admin-dashboard/teachers",
  );

  return response.data;
}

export async function getStudents() {
  const response = await api.get(
    "/admin-dashboard/students",
  );

  return response.data;
}

export async function getGroups() {
  const response = await api.get(
    "/admin-dashboard/groups",
  );

  return response.data;
}

export async function getSubjects() {
  const response = await api.get(
    "/admin-dashboard/subjects",
  );

  return response.data;
}

export async function getRooms() {
  const response = await api.get(
    "/admin-dashboard/rooms",
  );

  return response.data;
}

export async function getDevices() {
  const response = await api.get(
    "/admin-dashboard/devices",
  );

  return response.data;
}

export async function getSchedule() {
  const response = await api.get(
    "/admin-dashboard/schedule",
  );

  return response.data;
}