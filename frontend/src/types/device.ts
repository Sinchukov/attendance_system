import { Room } from './room';

export interface Device {
  id: number;

  name: string;

  serialNumber: string;

  roomId: number;

  room?: Room;

  createdAt?: string;

  updatedAt?: string;
}