import { api } from '../axios';

import { SubjectSubdivisionStudent } from '@/types/subject-subdivision-student';

export const subjectSubdivisionStudentsApi = {
  async getAll(): Promise<SubjectSubdivisionStudent[]> {
    const { data } = await api.get(
      '/subject-subdivision-students',
    );

    return data;
  },

  async create(
    subdivisionId: number,
    studentId: number,
  ) {
    const { data } = await api.post(
      '/subject-subdivision-students',
      {
        subdivisionId,
        studentId,
      },
    );

    return data;
  },
};