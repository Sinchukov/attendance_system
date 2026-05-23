const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const teacherService = {
  async getTeacherByUserId(userId: number) {
    const response = await fetch(
      `${API_URL}/teachers/user/${userId}`,
    );

    if (!response.ok) {
      throw new Error(
        "Ошибка загрузки преподавателя",
      );
    }

    return response.json();
  },
};