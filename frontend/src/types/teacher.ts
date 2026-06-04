import { User } from "./user";

export interface Teacher {
  id: number;
  fullName: string;
  cardNo: string | null;
  userId: number;
  createdAt: string;

  user?: User;
}