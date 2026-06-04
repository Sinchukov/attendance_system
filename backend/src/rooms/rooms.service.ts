import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  // СОЗДАНИЕ АУДИТОРИИ
  async create(dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        name: dto.name,
      },
    });
  }

  // ВСЕ АУДИТОРИИ
  async findAll() {
    return this.prisma.room.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  // ОДНА АУДИТОРИЯ
  async findOne(id: number) {
    return this.prisma.room.findUnique({
      where: {
        id,
      },

      include: {
        devices: true,

        scheduleTemplates: true,

        sessions: true,
      },
    });
  }

  update(id: number, dto: CreateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.room.delete({
      where: { id },
    });
  }
}
