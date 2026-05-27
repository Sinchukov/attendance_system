const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const attendanceService = {
  async getSessionStudents(
    sessionId: number,
  ) {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/lesson-sessions/${sessionId}/students`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        "Ошибка загрузки студентов",
      );
    }

    return response.json();
  },

  async updateAttendance(
    attendanceId: number,
    data: {
      status:
        | "PRESENT"
        | "LATE"
        | "ABSENT"
        | "EXCUSED";

      comment?: string;
    },
  ) {
    const token =
      localStorage.getItem("token");

    console.log(
      "TOKEN:",
      token,
    );

    const response = await fetch(
      `${API_URL}/attendance/${attendanceId}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const error =
        await response.json();

      console.log(
        "BACKEND ERROR:",
        error,
      );

      throw new Error(
        error.message ||
          "Ошибка обновления посещаемости",
      );
    }

    return response.json();
  },
};