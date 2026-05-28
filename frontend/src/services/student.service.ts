import { api } from "@/lib/api";

export const studentService = {
  async getAll() {
    const response =
      await api.get("/students");

    return response.data;
  },

  async create(data: {
    fullName: string;

    studentCardNo: string;

    groupId: number;
  }) {
    const response =
      await api.post(
        "/students",
        data,
      );

    return response.data;
  },

  async update(
    id: number,
    data: {
      fullName: string;

      studentCardNo: string;

      groupId: number;
    },
  ) {
    const response =
      await api.patch(
        `/students/${id}`,
        data,
      );

    return response.data;
  },

  async delete(id: number) {
  return api.delete(
    `/students/${id}`,
  );
},
};