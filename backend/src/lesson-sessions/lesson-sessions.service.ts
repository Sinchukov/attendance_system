import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import {
  LessonSession,
  Student,
  WeekDay,
  AttendanceStatus,
} from '@prisma/client';

@Injectable()
export class LessonSessionsService {
  constructor(private prisma: PrismaService) {}

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

    const createdSessions: LessonSession[] = [];

    for (const template of templates) {
      // ПРОВЕРЯЕМ СУЩЕСТВУЕТ ЛИ УЖЕ СЕССИЯ
      const existingSession = await this.prisma.lessonSession.findFirst({
        where: {
          lessonDate: date,

          templateId: template.id,
        },
      });

      if (existingSession) {
        continue;
      }

      // СОЗДАЕМ СЕССИЮ
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

  async generateAttendances(sessionId: number) {
    const session = await this.prisma.lessonSession.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return;
    }

    let students: Student[] = [];

    // ЕСЛИ ЕСТЬ ПОДГРУППА
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

    // СОЗДАЕМ ABSENT ATTENDANCE
    for (const student of students) {
      await this.prisma.attendance.create({
        data: {
          studentId: student.id,

          lessonSessionId: session.id,

          status: AttendanceStatus.ABSENT,
        },
      });
    }
  }

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
}
