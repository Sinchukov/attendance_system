import { api } from "@/lib/api";

export const groupService = {
  async getAll() {
    return api.get("/groups");
  },

  async create(data: {
    name: string;
  }) {
    return api.post(
      "/groups",
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
      `/groups/${id}`,
      data,
    );
  },

  async delete(id: number) {
    return api.delete(
      `/groups/${id}`,
    );
  },
};