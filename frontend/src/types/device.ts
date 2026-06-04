import { Room } from "./room";

export interface Device {
  id: number;

  serialNumber: string;

  roomId: number;

  createdAt: string;

  room?: Room;
}