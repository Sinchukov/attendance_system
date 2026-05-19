import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateScheduleTemplateDto } from './dto/create-schedule-template.dto';

@Injectable()
export class ScheduleTemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduleTemplateDto) {
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
}
