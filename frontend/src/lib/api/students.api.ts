import { api } from "./axios";

export const StudentsApi = {
  getAll() {
    return api.get("/students");
  },

  getById(id: number) {
    return api.get(`/students/${id}`);
  },

  getByCard(studentCardNo: string) {
    return api.get(
      `/students/card/${studentCardNo}`
    );
  },

  create(data: {
    fullName: string;
    studentCardNo: string;
    groupId: number;
  }) {
    return api.post("/students", data);
  },

  update(
    id: number,
    data: Record<string, unknown>
  ) {
    return api.patch(`/students/${id}`, data);
  },

  delete(id: number) {
    return api.delete(`/students/${id}`);
  },
};