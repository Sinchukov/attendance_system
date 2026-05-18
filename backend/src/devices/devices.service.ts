import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  // СОЗДАНИЕ УСТРОЙСТВА
  async create(dto: CreateDeviceDto) {
    return this.prisma.device.create({
      data: {
        serialNumber: dto.serialNumber,

        room: {
          connect: {
            id: dto.roomId,
          },
        },
      },

      include: {
        room: true,
      },
    });
  }

  // ВСЕ УСТРОЙСТВА
  async findAll() {
    return this.prisma.device.findMany({
      include: {
        room: true,
      },

      orderBy: {
        id: 'asc',
      },
    });
  }

  // УСТРОЙСТВО ПО SERIAL NUMBER
  async findBySerial(serialNumber: string) {
    return this.prisma.device.findUnique({
      where: {
        serialNumber,
      },

      include: {
        room: true,
      },
    });
  }

  // УСТРОЙСТВО ПО ID
  async findOne(id: number) {
    return this.prisma.device.findUnique({
      where: {
        id,
      },

      include: {
        room: true,
      },
    });
  }
}
