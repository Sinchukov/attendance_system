import { api } from "../axios";

export const DevicesApi = {
  getAll() {
    return api.get("/admin-dashboard/devices");
  },
};