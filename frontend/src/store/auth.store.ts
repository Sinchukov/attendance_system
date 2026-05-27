import { create } from "zustand";

interface User {
  id: number;

  email: string;

  role: string;

  teacherId?: number | null;

  teacherName?: string | null;
}

interface AuthState {
  user: User | null;

  token: string | null;

  setAuth: (
    user: User,
    token: string,
  ) => void;

  logout: () => void;

  loadFromStorage: () => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,

    token: null,

    setAuth: (user, token) => {
      localStorage.setItem(
        "token",
        token,
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user),
      );

      set({
        user,
        token,
      });
    },

    loadFromStorage: () => {
      const token =
        localStorage.getItem("token");

      const user =
        localStorage.getItem("user");

      set({
        token,

        user: user
          ? JSON.parse(user)
          : null,
      });
    },

    logout: () => {
      localStorage.removeItem(
        "token",
      );

      localStorage.removeItem(
        "user",
      );

      set({
        user: null,

        token: null,
      });

      window.location.href =
        "/login";
    },
  }));