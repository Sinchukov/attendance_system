export interface User {
  id: number;

  email: string;

  role: 'ADMIN' | 'TEACHER';

  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;
}