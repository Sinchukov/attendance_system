/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AttendanceEventType, AttendanceStatus, WeekDay } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CheckInDto } from './dto/check-in.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // =====================================================
  // CHECK-IN
  // =====================================================

  async checkIn(dto: CheckInDto) {
    // 1. ИЩЕМ УСТРОЙСТВО

    const device = await this.prisma.device.findUnique({
      where: {
        serialNumber: dto.deviceSerialNumber,
      },

      include: {
        room: true,
      },
    });

    if (!device) {
      await this.createAuditLog({
        dto,
        eventType: AttendanceEventType.DEVICE_NOT_FOUND,
        message: 'Устройство не найдено',
      });

      throw new NotFoundException('Устройство не найдено');
    }

    // 2. ИЩЕМ СТУДЕНТА

    const student = await this.prisma.student.findUnique({
      where: {
        studentCardNo: dto.cardNo,
      },
    });

    if (!student) {
      await this.createAuditLog({
        dto,
        deviceId: device.id,
        eventType: AttendanceEventType.STUDENT_NOT_FOUND,
        message: 'Студент не найден',
      });

      throw new NotFoundException('Студент не найден');
    }

    // 3. ТЕКУЩЕЕ ВРЕМЯ

    const now = new Date();

    const jsDay = now.getDay();

    const weekdayMap: Partial<Record<number, WeekDay>> = {
      1: WeekDay.MONDAY,
      2: WeekDay.TUESDAY,
      3: WeekDay.WEDNESDAY,
      4: WeekDay.THURSDAY,
      5: WeekDay.FRIDAY,
      6: WeekDay.SATURDAY,
    };

    if (!weekdayMap[jsDay]) {
      await this.createAuditLog({
        dto,
        studentId: student.id,
        deviceId: device.id,
        eventType: AttendanceEventType.NO_ACTIVE_SESSION,
        message: 'Сегодня нет учебных занятий',
      });

      throw new NotFoundException('Сегодня нет учебных занятий');
    }

    // 4. ВРЕМЯ HH:mm

    const currentTime = now.toTimeString().slice(0, 5);

    // 5. ГРАНИЦЫ ДНЯ

    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();

    endOfDay.setHours(23, 59, 59, 999);

    // 6. ИЩЕМ ПАРЫ В ЭТОЙ АУДИТОРИИ

    const sessions = await this.prisma.lessonSession.findMany({
      where: {
        roomId: device.roomId,

        isCancelled: false,

        lessonDate: {
          gte: startOfDay,

          lte: endOfDay,
        },
      },

      include: {
        pairTime: true,
      },

      orderBy: {
        pairTimeId: 'asc',
      },
    });

    // 7. ИЩЕМ АКТИВНУЮ ПАРУ

    const currentSession = sessions.find((lessonSession) => {
      return (
        currentTime >= lessonSession.pairTime.startTime &&
        currentTime <= lessonSession.pairTime.endTime
      );
    });

    if (!currentSession) {
      await this.createAuditLog({
        dto,
        studentId: student.id,
        deviceId: device.id,
        eventType: AttendanceEventType.NO_ACTIVE_SESSION,
        message: 'Сейчас нет пары в этой аудитории',
      });

      throw new NotFoundException('Сейчас нет пары в этой аудитории');
    }

    // 8. ПРОВЕРКА ГРУППЫ

    if (currentSession.groupId !== student.groupId) {
      await this.createAuditLog({
        dto,
        studentId: student.id,
        deviceId: device.id,
        lessonSessionId: currentSession.id,
        eventType: AttendanceEventType.INVALID_SESSION,
        message: 'Студент не относится к этой группе',
      });

      throw new BadRequestException('Студент не относится к этой группе');
    }

    // 9. ПРОВЕРКА ПОДГРУППЫ

    if (currentSession.subdivisionId) {
      const exists = await this.prisma.subjectSubdivisionStudent.findFirst({
        where: {
          subdivisionId: currentSession.subdivisionId,

          studentId: student.id,
        },
      });

      if (!exists) {
        await this.createAuditLog({
          dto,
          studentId: student.id,
          deviceId: device.id,
          lessonSessionId: currentSession.id,
          eventType: AttendanceEventType.INVALID_SESSION,
          message: 'Студент не входит в подгруппу',
        });

        throw new BadRequestException('Студент не входит в подгруппу');
      }
    }

    // 10. ИЩЕМ ATTENDANCE

    const existingAttendance = await this.prisma.attendance.findUnique({
      where: {
        studentId_lessonSessionId: {
          studentId: student.id,

          lessonSessionId: currentSession.id,
        },
      },
    });

    // 11. ПРОВЕРКА ВРЕМЕНИ

    const pairStart = currentSession.pairTime.startTime;

    const currentMinutes = this.timeToMinutes(currentTime);

    const pairStartMinutes = this.timeToMinutes(pairStart);

    // МОЖНО ПРИЙТИ ЗА 15 МИНУТ ДО ПАРЫ

    const earlyWindow = pairStartMinutes - 15;

    // ПОСЛЕ +20 МИНУТ НЕ ПУСКАЕМ

    const lateWindow = pairStartMinutes + 20;

    if (currentMinutes < earlyWindow || currentMinutes > lateWindow) {
      await this.createAuditLog({
        dto,
        studentId: student.id,
        deviceId: device.id,
        lessonSessionId: currentSession.id,
        eventType: AttendanceEventType.INVALID_SESSION,
        message: 'Время отметки вне диапазона',
      });

      throw new BadRequestException('Время отметки вне допустимого диапазона');
    }

    // 12. СТАТУС

    const status =
      currentMinutes <= pairStartMinutes + 15
        ? AttendanceStatus.PRESENT
        : AttendanceStatus.LATE;

    // 13. УЖЕ ОТМЕЧЕН

    if (existingAttendance) {
      if (existingAttendance.checkIn) {
        const seconds = this.secondsBetween(existingAttendance.checkIn, now);

        // АНТИСПАМ

        if (seconds <= 10) {
          await this.createAuditLog({
            dto,
            studentId: student.id,
            deviceId: device.id,
            lessonSessionId: currentSession.id,
            attendanceId: existingAttendance.id,
            eventType: AttendanceEventType.SPAM_DETECTED,
            message: 'Слишком частое сканирование',
          });

          throw new BadRequestException('Слишком частое сканирование карты');
        }

        await this.createAuditLog({
          dto,
          studentId: student.id,
          deviceId: device.id,
          lessonSessionId: currentSession.id,
          attendanceId: existingAttendance.id,
          eventType: AttendanceEventType.DUPLICATE_CHECK_IN,
          message: 'Повторная отметка посещения',
        });

        throw new BadRequestException('Посещение уже отмечено');
      }

      const updatedAttendance = await this.prisma.attendance.update({
        where: {
          id: existingAttendance.id,
        },

        data: {
          status,

          checkIn: now,
        },

        include: {
          student: true,

          lessonSession: {
            include: {
              subject: true,
              teacher: true,
              room: true,
              pairTime: true,
              group: true,
            },
          },
        },
      });

      await this.createAuditLog({
        dto,
        studentId: student.id,
        deviceId: device.id,
        lessonSessionId: currentSession.id,
        attendanceId: updatedAttendance.id,
        eventType: AttendanceEventType.CHECK_IN_SUCCESS,
        message: 'Успешная отметка посещения',
      });

      return updatedAttendance;
    }

    // 14. СОЗДАЕМ ATTENDANCE

    const attendance = await this.prisma.attendance.create({
      data: {
        studentId: student.id,

        lessonSessionId: currentSession.id,

        status,

        checkIn: now,
      },

      include: {
        student: true,

        lessonSession: {
          include: {
            subject: true,
            teacher: true,
            room: true,
            pairTime: true,
            group: true,
          },
        },
      },
    });

    // 15. CHANGE LOG

    await this.prisma.attendanceChangeLog.create({
      data: {
        attendanceId: attendance.id,

        newStatus: status,

        action: 'CHECK_IN',

        deviceId: device.id,

        details: `Check-in через устройство ${device.serialNumber}`,
      },
    });

    // 16. AUDIT LOG

    await this.createAuditLog({
      dto,
      studentId: student.id,
      deviceId: device.id,
      lessonSessionId: currentSession.id,
      attendanceId: attendance.id,
      eventType: AttendanceEventType.CHECK_IN_SUCCESS,
      message: 'Успешная отметка посещения',
    });

    return attendance;
  }

  // =====================================================
  // ВСЕ ATTENDANCE
  // =====================================================

  async findAll() {
    return this.prisma.attendance.findMany({
      include: {
        student: {
          include: {
            group: true,
          },
        },

        lessonSession: {
          include: {
            subject: true,
            teacher: true,
            room: true,
            pairTime: true,
          },
        },

        changeLogs: true,
      },

      orderBy: {
        id: 'asc',
      },
    });
  }

  // =====================================================
  // MANUAL EDIT
  // =====================================================

  async manualEdit(attendanceId: number, dto: UpdateAttendanceDto) {
    const attendance = await this.prisma.attendance.findUnique({
      where: {
        id: attendanceId,
      },

      include: {
        lessonSession: true,
      },
    });

    if (!attendance) {
      throw new NotFoundException('Attendance не найден');
    }

    const updatedAttendance = await this.prisma.attendance.update({
      where: {
        id: attendanceId,
      },

      data: {
        status: dto.status,

        checkIn: dto.checkIn ?? attendance.checkIn,

        isManualEdited: true,
      },
    });

    // CHANGE LOG

    await this.prisma.attendanceChangeLog.create({
      data: {
        attendanceId: attendance.id,

        teacherId: dto.teacherId,

        oldStatus: attendance.status,

        newStatus: dto.status,

        action: 'MANUAL_EDIT',

        details: 'Ручное изменение посещения преподавателем',
      },
    });

    return updatedAttendance;
  }

  // =====================================================
  // HELPERS
  // =====================================================

  private timeToMinutes(time: string) {
    const [hours, mins] = time.split(':').map(Number);

    return hours * 60 + mins;
  }

  private secondsBetween(date1: Date, date2: Date) {
    return Math.abs(date1.getTime() - date2.getTime()) / 1000;
  }

  // =====================================================
  // AUDIT LOG HELPER
  // =====================================================

  private async createAuditLog(params: {
    dto: CheckInDto;

    eventType: AttendanceEventType;

    message: string;

    studentId?: number;

    lessonSessionId?: number;

    attendanceId?: number;

    deviceId?: number;
  }) {
    await this.prisma.attendanceAuditLog.create({
      data: {
        cardNo: params.dto.cardNo,

        deviceSerial: params.dto.deviceSerialNumber,

        eventType: params.eventType,

        message: params.message,

        studentId: params.studentId,

        lessonSessionId: params.lessonSessionId,

        attendanceId: params.attendanceId,

        deviceId: params.deviceId,
      },
    });
  }
}
