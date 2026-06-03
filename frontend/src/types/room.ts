export interface Room {
  id: number;

  name: string;

  building?: string | null;

  capacity?: number | null;

  createdAt?: string;

  updatedAt?: string;
}