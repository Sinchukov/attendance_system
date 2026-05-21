/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, NotFoundException } from '@nestjs/common';

import { WeekDay } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CancelLessonDto } from './dto/cancel-lesson.dto';
import { CreateLessonSessionDto } from './dto/create-lesson-session.dto';

@Injectable()
export class LessonSessionsService {
  constructor(private prisma: PrismaService) {}

  // =====================================================
  // СОЗДАНИЕ КОНКРЕТНОЙ ПАРЫ ВРУЧНУЮ
  // =====================================================

  async create(dto: CreateLessonSessionDto) {
    const session = await this.prisma.lessonSession.create({
      data: {
        lessonDate: new Date(dto.lessonDate),

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

    // АВТОМАТИЧЕСКИ СОЗДАЕМ ATTENDANCE
    await this.generateAttendances(session.id);

    return session;
  }

  // =====================================================
  // ГЕНЕРАЦИЯ ПО ШАБЛОНАМ
  // =====================================================

  async generateForDate(date: Date) {
    const jsDay = date.getDay();

    const weekdayMap: Partial<Record<number, WeekDay>> = {
      1: WeekDay.MONDAY,
      2: WeekDay.TUESDAY,
      3: WeekDay.WEDNESDAY,
      4: WeekDay.THURSDAY,
      5: WeekDay.FRIDAY,
      6: WeekDay.SATURDAY,
    };

    const weekday = weekdayMap[jsDay];

    if (!weekday) {
      return [];
    }

    // ИЩЕМ ШАБЛОНЫ
    const templates = await this.prisma.scheduleTemplate.findMany({
      where: {
        weekday,

        isActive: true,
      },
    });

    const createdSessions: any[] = [];

    for (const template of templates) {
      // ПРОВЕРЯЕМ СУЩЕСТВУЕТ ЛИ УЖЕ
      const existingSession = await this.prisma.lessonSession.findFirst({
        where: {
          lessonDate: date,

          templateId: template.id,
        },
      });

      if (existingSession) {
        continue;
      }

      // СОЗДАЕМ ПАРУ
      const session = await this.prisma.lessonSession.create({
        data: {
          lessonDate: date,

          lessonType: template.lessonType,

          subjectId: template.subjectId,

          teacherId: template.teacherId,

          roomId: template.roomId,

          pairTimeId: template.pairTimeId,

          groupId: template.groupId,

          subdivisionId: template.subdivisionId,

          templateId: template.id,
        },
      });

      createdSessions.push(session);

      // СОЗДАЕМ ATTENDANCE
      await this.generateAttendances(session.id);
    }

    return createdSessions;
  }

  // =====================================================
  // СОЗДАНИЕ ATTENDANCE
  // =====================================================

  async generateAttendances(sessionId: number) {
    const session = await this.prisma.lessonSession.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return;
    }

    let students: any[] = [];

    // ЕСЛИ ПОДГРУППА
    if (session.subdivisionId) {
      const subdivisionStudents =
        await this.prisma.subjectSubdivisionStudent.findMany({
          where: {
            subdivisionId: session.subdivisionId,
          },

          include: {
            student: true,
          },
        });

      students = subdivisionStudents.map((item) => item.student);
    } else {
      students = await this.prisma.student.findMany({
        where: {
          groupId: session.groupId,
        },
      });
    }

    for (const student of students) {
      const exists = await this.prisma.attendance.findFirst({
        where: {
          studentId: student.id,

          lessonSessionId: session.id,
        },
      });

      if (exists) {
        continue;
      }

      await this.prisma.attendance.create({
        data: {
          studentId: student.id,

          lessonSessionId: session.id,

          status: 'ABSENT',
        },
      });
    }
  }

  // =====================================================
  // ВСЕ ПАРЫ
  // =====================================================

  async findAll() {
    return this.prisma.lessonSession.findMany({
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
          lessonDate: 'asc',
        },
      ],
    });
  }

  // =====================================================
  // ПАРЫ ПО ДАТЕ
  // =====================================================

  async findByDate(date: string) {
    return this.prisma.lessonSession.findMany({
      where: {
        lessonDate: new Date(date),
      },

      include: {
        subject: true,
        teacher: true,
        room: true,
        pairTime: true,
        group: true,
        subdivision: true,
      },

      orderBy: {
        pairTimeId: 'asc',
      },
    });
  }

  // =====================================================
  // ОТМЕНА ПАРЫ
  // =====================================================

  async cancel(id: number, dto: CancelLessonDto) {
    const session = await this.prisma.lessonSession.findUnique({
      where: {
        id,
      },
    });

    if (!session) {
      throw new NotFoundException('Занятие не найдено');
    }

    return this.prisma.lessonSession.update({
      where: {
        id,
      },

      data: {
        isCancelled: true,

        cancellationReason: dto.reason,
      },
    });
  }
}
