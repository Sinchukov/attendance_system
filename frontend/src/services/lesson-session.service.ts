const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const lessonSessionService =
  {
    async getMySessions() {
      const token =
        localStorage.getItem(
          "token",
        );

      const response =
        await fetch(
          `${API_URL}/lesson-sessions/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

      if (!response.ok) {
        throw new Error(
          "Ошибка загрузки пар",
        );
      }

      return response.json();
    },

    async getMyWeekSessions() {
      const token =
        localStorage.getItem(
          "token",
        );

      const response =
        await fetch(
          `${API_URL}/lesson-sessions/my/week`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

      if (!response.ok) {
        throw new Error(
          "Ошибка загрузки расписания",
        );
      }

      return response.json();
    },
  };