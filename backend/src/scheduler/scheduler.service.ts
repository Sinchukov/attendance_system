import { Injectable } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';

import { AttendanceEventType, AttendanceStatus, WeekDay } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulerService {
  constructor(private prisma: PrismaService) {}

  // =====================================================
  // ГЕНЕРАЦИЯ ПАР НА СЛЕДУЮЩИЙ ДЕНЬ
  // =====================================================

  @Cron('0 1 * * *')
  async generateSessions() {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    tomorrow.setHours(0, 0, 0, 0);

    const jsDay = tomorrow.getDay();

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
      return;
    }

    const templates = await this.prisma.scheduleTemplate.findMany({
      where: {
        weekday,
        isActive: true,
      },
    });

    for (const template of templates) {
      const existingSession = await this.prisma.lessonSession.findFirst({
        where: {
          templateId: template.id,
          lessonDate: tomorrow,
        },
      });

      if (existingSession) {
        continue;
      }

      await this.prisma.lessonSession.create({
        data: {
          lessonDate: tomorrow,

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
    }

    console.log('LessonSession успешно созданы');
  }

  // =====================================================
  // AUTO ABSENT
  // =====================================================

  @Cron('*/5 * * * *')
  async generateAbsents() {
    const now = new Date();

    const currentTime = now.toTimeString().slice(0, 5);

    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();

    endOfDay.setHours(23, 59, 59, 999);

    // ВСЕ СЕГОДНЯШНИЕ ПАРЫ

    const sessions = await this.prisma.lessonSession.findMany({
      where: {
        lessonDate: {
          gte: startOfDay,
          lte: endOfDay,
        },

        isCancelled: false,
      },

      include: {
        pairTime: true,

        group: {
          include: {
            students: true,
          },
        },

        attendances: true,
      },
    });

    for (const session of sessions) {
      // ЕСЛИ ПАРА ЕЩЕ НЕ ЗАКОНЧИЛАСЬ

      if (currentTime <= session.pairTime.endTime) {
        continue;
      }

      // ВСЕ СТУДЕНТЫ ГРУППЫ

      let students = session.group.students;

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

        students = subdivisionStudents.map((s) => s.student);
      }

      // ПРОВЕРКА КАЖДОГО СТУДЕНТА

      for (const student of students) {
        const alreadyExists = session.attendances.find(
          (attendance) => attendance.studentId === student.id,
        );

        // ATTENDANCE УЖЕ ЕСТЬ

        if (alreadyExists) {
          continue;
        }

        // СОЗДАЕМ ABSENT

        const absentAttendance = await this.prisma.attendance.create({
          data: {
            studentId: student.id,

            lessonSessionId: session.id,

            status: AttendanceStatus.ABSENT,
          },
        });

        // CHANGE LOG

        await this.prisma.attendanceChangeLog.create({
          data: {
            attendanceId: absentAttendance.id,

            newStatus: AttendanceStatus.ABSENT,

            action: 'AUTO_ABSENT',

            details: 'Автоматически отмечено системой',
          },
        });

        // AUDIT LOG

        await this.prisma.attendanceAuditLog.create({
          data: {
            cardNo: student.studentCardNo,

            deviceSerial: 'SYSTEM',

            eventType: AttendanceEventType.INVALID_SESSION,

            message: 'Автоматически создан ABSENT',

            studentId: student.id,

            lessonSessionId: session.id,

            attendanceId: absentAttendance.id,
          },
        });
      }
    }

    console.log('ABSENT обработка завершена');
  }
}
