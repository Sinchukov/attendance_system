import { api } from "@/lib/api";

export const subjectService = {
  async getAll() {
    return api.get("/subjects");
  },

  async create(data: {
    name: string;
  }) {
    return api.post(
      "/subjects",
      data,
    );
  },

  async update(
    id: number,
    data: {
      name: string;
    },
  ) {
    return api.patch(
      `/subjects/${id}`,
      data,
    );
  },

  async delete(id: number) {
    return api.delete(
      `/subjects/${id}`,
    );
  },
};