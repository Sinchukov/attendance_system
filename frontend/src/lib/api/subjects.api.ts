import { api } from "../axios";

export const SubjectsApi = {
  getAll() {
    return api.get("/admin-dashboard/subjects");
  },
};