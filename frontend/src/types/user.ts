export type UserRole =
  | "ADMIN"
  | "TEACHER";

export interface User {
  id: number;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}