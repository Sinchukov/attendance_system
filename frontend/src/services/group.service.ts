import { api } from "@/lib/api";

export const groupService = {
  async getAll() {
    return api.get("/academic-groups");
  },

  async create(data: {
    name: string;
  }) {
    return api.post(
      "/academic-groups",
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
      `/academic-groups/${id}`,
      data,
    );
  },

  async delete(id: number) {
    return api.delete(
      `/academic-groups/${id}`,
    );
  },
};