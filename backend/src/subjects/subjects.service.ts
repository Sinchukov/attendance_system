import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  // СОЗДАНИЕ ПРЕДМЕТА
  async create(dto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: {
        name: dto.name,
      },
    });
  }
  update(id: number, dto: CreateSubjectDto) {
    return this.prisma.subject.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.subject.delete({
      where: { id },
    });
  }
  // ВСЕ ПРЕДМЕТЫ
  async findAll() {
    return this.prisma.subject.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  // ОДИН ПРЕДМЕТ
  async findOne(id: number) {
    return this.prisma.subject.findUnique({
      where: {
        id,
      },

      include: {
        scheduleTemplates: true,

        sessions: true,

        subdivisions: true,
      },
    });
  }
}
