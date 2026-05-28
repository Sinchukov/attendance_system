import { api } from "@/lib/api";

export const roomService = {
  async getAll() {
    return api.get("/rooms");
  },

  async create(data: {
    name: string;
  }) {
    return api.post(
      "/rooms",
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
      `/rooms/${id}`,
      data,
    );
  },

  async delete(id: number) {
    return api.delete(
      `/rooms/${id}`,
    );
  },
};