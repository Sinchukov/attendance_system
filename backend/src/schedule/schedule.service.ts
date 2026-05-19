/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduleDto) {
    return this.prisma.scheduleTemplate.create({
      data: {
        weekday: dto.weekday,

        lessonType: dto.lessonType,

        subjectId: dto.subjectId,

        teacherId: dto.teacherId,

        roomId: dto.roomId,

        pairTimeId: dto.pairTimeId,

        groupId: dto.groupId,

        subdivisionId: dto.subdivisionId ?? null,
      },

      include: {
        subject: true,

        teacher: true,

        room: true,

        pairTime: true,

        group: true,

        subdivision: true,
      },
    });
  }

  async findAll() {
    return this.prisma.scheduleTemplate.findMany({
      include: {
        subject: true,

        teacher: true,

        room: true,

        pairTime: true,

        group: true,

        subdivision: true,
      },

      orderBy: [{ weekday: 'asc' }, { pairTimeId: 'asc' }],
    });
  }

  async findByGroup(groupId: number) {
    return this.prisma.scheduleTemplate.findMany({
      where: {
        groupId,
      },

      include: {
        subject: true,

        teacher: true,

        room: true,

        pairTime: true,

        group: true,

        subdivision: true,
      },

      orderBy: [
        {
          weekday: 'asc',
        },
        {
          pairTimeId: 'asc',
        },
      ],
    });
  }

  async findByGroupAndDay(groupId: number, weekday: any) {
    return this.prisma.scheduleTemplate.findMany({
      where: {
        groupId,

        weekday,
      },

      include: {
        subject: true,

        teacher: true,

        room: true,

        pairTime: true,

        subdivision: true,
      },

      orderBy: {
        pairTimeId: 'asc',
      },
    });
  }
}
