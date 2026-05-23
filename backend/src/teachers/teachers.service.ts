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
  async findByUserId(userId: number) {
    return this.prisma.teacher.findUnique({
      where: {
        userId,
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
  async findOne(id: number) {
    return this.prisma.teacher.findUnique({
      where: {
        userId: id,
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

  async getTeacherSchedule(teacherId: number) {
    return this.prisma.scheduleTemplate.findMany({
      where: {
        teacherId,
      },

      include: {
        subject: true,
        group: true,
        room: true,
        pairTime: true,
        subdivision: true,
      },

      orderBy: [
        {
          weekday: 'asc',
        },

        {
          pairTime: {
            pairNumber: 'asc',
          },
        },
      ],
    });
  }

  async getTodaySessions(teacherId: number) {
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );

    return this.prisma.lessonSession.findMany({
      where: {
        teacherId,

        lessonDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },

      include: {
        subject: true,
        group: true,
        room: true,
        pairTime: true,
        subdivision: true,
      },

      orderBy: {
        pairTime: {
          pairNumber: 'asc',
        },
      },
    });
  }
}
