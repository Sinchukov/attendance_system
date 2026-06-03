import { api } from "./axios";

export const RoomsApi = {
  getAll() {
    return api.get("/admin-dashboard/rooms");
  },
};