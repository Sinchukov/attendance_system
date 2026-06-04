import { api } from "../axios";

export const AuthApi = {
  login(email: string, password: string) {
    return api.post("/auth/login", {
      email,
      password,
    });
  },

  me() {
    return api.get("/auth/me");
  },
};