import { api } from '../axios';

import { SubjectSubdivision } from '@/types/subject-subdivision';

export const subjectSubdivisionsApi = {
  async getAll(): Promise<SubjectSubdivision[]> {
    const { data } = await api.get('/subject-subdivisions');

    return data;
  },

  async getByGroup(groupId: number) {
    const { data } = await api.get(
      `/subject-subdivisions/group/${groupId}`,
    );

    return data;
  },

  async getBySubject(subjectId: number) {
    const { data } = await api.get(
      `/subject-subdivisions/subject/${subjectId}`,
    );

    return data;
  },

  async create(payload: {
    name: string;
    subjectId: number;
    groupId: number;
  }) {
    const { data } = await api.post(
      '/subject-subdivisions',
      payload,
    );

    return data;
  },

  async addStudents(
    subdivisionId: number,
    studentIds: number[],
  ) {
    const { data } = await api.post(
      `/subject-subdivisions/${subdivisionId}/students`,
      {
        studentIds,
      },
    );

    return data;
  },
};