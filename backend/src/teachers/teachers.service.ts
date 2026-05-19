import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: {
        fullName: dto.fullName,

        cardNo: dto.cardNo ?? null,

        user: {
          create: {
            email: dto.email,

            password: dto.password,

            role: 'TEACHER',
          },
        },
      },

      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.teacher.findMany({
      include: {
        user: true,
      },

      orderBy: {
        fullName: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.teacher.findUnique({
      where: {
        id,
      },

      include: {
        user: true,

        scheduleTemplates: {
          include: {
            subject: true,
            group: true,
            room: true,
            pairTime: true,
            subdivision: true,
          },
        },

        sessions: {
          include: {
            subject: true,
            group: true,
            room: true,
            pairTime: true,
            subdivision: true,
          },
        },
      },
    });
  }
}
