const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const attendanceService = {
  async getSessionStudents(
    sessionId: number,
  ) {
    const response = await fetch(
      `${API_URL}/lesson-sessions/${sessionId}/students`,
    );

    if (!response.ok) {
      throw new Error(
        'Ошибка загрузки студентов',
      );
    }

    return response.json();
  },

  async updateAttendance(
    attendanceId: number,
    status:
      | 'PRESENT'
      | 'LATE'
      | 'ABSENT',
  ) {
    const response = await fetch(
      `${API_URL}/lesson-sessions/attendance/${attendanceId}`,
      {
        method: 'PATCH',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          status,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        'Ошибка обновления посещаемости',
      );
    }

    return response.json();
  },
};