import { Injectable, NotFoundException } from '@nestjs/common';

import { AttendanceStatus, WeekDay } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CheckInDto } from './dto/check-in.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

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
      throw new NotFoundException('Устройство не найдено');
    }

    // 2. ИЩЕМ СТУДЕНТА
    const student = await this.prisma.student.findUnique({
      where: {
        studentCardNo: dto.cardNo,
      },
    });

    if (!student) {
      throw new NotFoundException('Студент не найден');
    }

    // 3. ТЕКУЩЕЕ ВРЕМЯ
    const now = new Date();

    // 4. ДЕНЬ НЕДЕЛИ
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
      throw new NotFoundException('Сегодня нет учебных занятий');
    }

    const currentWeekday = weekdayMap[jsDay];

    // 5. ТЕКУЩЕЕ ВРЕМЯ HH:mm
    const currentTime = now.toTimeString().slice(0, 5);

    // 6. ИЩЕМ ТЕКУЩУЮ ПАРУ
    const schedules = await this.prisma.schedule.findMany({
      where: {
        weekday: currentWeekday,

        roomId: device.roomId,
      },

      include: {
        pairTime: true,
      },
    });

    const currentSchedule = schedules.find((schedule) => {
      return (
        currentTime >= schedule.pairTime.startTime &&
        currentTime <= schedule.pairTime.endTime
      );
    });

    if (!currentSchedule) {
      throw new NotFoundException('Сейчас нет пары в этой аудитории');
    }

    // 7. ПРОВЕРКА ГРУППЫ
    if (currentSchedule.groupId !== student.groupId) {
      throw new NotFoundException('Студент не относится к этой паре');
    }

    // 8. ПРОВЕРКА ПОДГРУППЫ
    if (currentSchedule.subdivisionId) {
      const exists = await this.prisma.subjectSubdivisionStudent.findFirst({
        where: {
          subdivisionId: currentSchedule.subdivisionId,

          studentId: student.id,
        },
      });

      if (!exists) {
        throw new NotFoundException('Студент не входит в подгруппу');
      }
    }

    // 9. ПРОВЕРЯЕМ ATTENDANCE
    const existingAttendance = await this.prisma.attendance.findUnique({
      where: {
        studentId_scheduleId: {
          studentId: student.id,

          scheduleId: currentSchedule.id,
        },
      },
    });

    // 10. ОПРЕДЕЛЯЕМ СТАТУС
    const pairStart = currentSchedule.pairTime.startTime;

    const isLate =
      currentTime > '09:15'
        ? true
        : currentTime > this.addMinutes(pairStart, 15);

    const status = isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

    // 11. ЕСЛИ УЖЕ ЕСТЬ ATTENDANCE
    if (existingAttendance) {
      return this.prisma.attendance.update({
        where: {
          id: existingAttendance.id,
        },

        data: {
          checkOut: now,
        },
      });
    }

    // 12. СОЗДАЕМ ATTENDANCE
    return this.prisma.attendance.create({
      data: {
        studentId: student.id,

        scheduleId: currentSchedule.id,

        status,

        checkIn: now,

        checkOut: now,
      },

      include: {
        student: true,

        schedule: {
          include: {
            subject: true,
            teacher: true,
            room: true,
          },
        },
      },
    });
  }

  private addMinutes(time: string, minutes: number) {
    const [hours, mins] = time.split(':').map(Number);

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(mins + minutes);

    return date.toTimeString().slice(0, 5);
  }

  async manualEdit(attendanceId: number, dto: UpdateAttendanceDto) {
    const attendance = await this.prisma.attendance.findUnique({
      where: {
        id: attendanceId,
      },
    });

    if (!attendance) {
      throw new Error('Attendance not found');
    }

    const updatedAttendance = await this.prisma.attendance.update({
      where: {
        id: attendanceId,
      },

      data: {
        status: dto.status,

        checkIn: dto.checkIn ?? attendance.checkIn,

        checkOut: dto.checkOut ?? attendance.checkOut,

        isManualEdited: true,
      },
    });

    await this.prisma.attendanceChangeLog.create({
      data: {
        attendanceId: attendance.id,

        teacherId: dto.teacherId,

        oldStatus: attendance.status,

        newStatus: dto.status,
      },
    });

    return updatedAttendance;
  }
}
