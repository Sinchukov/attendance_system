const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const scheduleService = {
  async getTeacherSchedule(
    teacherId: number,
  ) {
    const response = await fetch(
      `${API_URL}/teachers/${teacherId}/schedule`,
    );

    if (!response.ok) {
      throw new Error(
        'Ошибка загрузки расписания',
      );
    }

    return response.json();
  },
};