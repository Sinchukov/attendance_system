import { api } from "./axios";

export const UsersApi = {
  getAll() {
    return api.get("/admin-dashboard/users");
  },

  getById(id: number) {
    return api.get(`/admin-dashboard/users/${id}`);
  },

  activate(id: number) {
    return api.patch(
      `/admin-dashboard/users/${id}/activate`
    );
  },

  deactivate(id: number) {
    return api.patch(
      `/admin-dashboard/users/${id}/deactivate`
    );
  },

  changePassword(
    id: number,
    password: string
  ) {
    return api.patch(
      `/admin-dashboard/users/${id}/password`,
      {
        password,
      }
    );
  },
};