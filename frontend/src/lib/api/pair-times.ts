import { api } from '../axios';

import { PairTime } from '@/types/pair-time';

export const pairTimesApi = {
  async getAll(): Promise<PairTime[]> {
    const { data } = await api.get('/pair-times');

    return data;
  },

  async getById(id: number): Promise<PairTime> {
    const { data } = await api.get(`/pair-times/${id}`);

    return data;
  },

  async create(payload: Partial<PairTime>) {
    const { data } = await api.post('/pair-times', payload);

    return data;
  },

  async update(id: number, payload: Partial<PairTime>) {
    const { data } = await api.patch(`/pair-times/${id}`, payload);

    return data;
  },

  async delete(id: number) {
    const { data } = await api.delete(`/pair-times/${id}`);

    return data;
  },
};