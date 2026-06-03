import { User } from './user';

export interface Teacher {
  id: number;

  fullName: string;

  userId: number;

  user?: User;

  createdAt?: string;

  updatedAt?: string;
}