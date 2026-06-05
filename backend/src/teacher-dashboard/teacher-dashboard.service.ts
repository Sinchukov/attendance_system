/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherDashboardService {
  constructor(private prisma: PrismaService) {}

  async getTeacherInfo(userId: number) {
    return this.prisma.teacher.findUnique({
      where: {
        userId,
      },

      include: {
        user: true,
      },
    });
  }

  async getSchedule(userId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId,
      },
    });

    if (!teacher) {
      return [];
    }

    return this.prisma.scheduleTemplate.findMany({
      where: {
        teacherId: teacher.id,
      },

      include: {
        subject: true,
        room: true,
        group: true,
        pairTime: true,
        subdivision: true,
      },
    });
  }

  async getTodaySessions(userId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId,
      },
    });

    if (!teacher) {
      return [];
    }

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
        teacherId: teacher.id,

        lessonDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },

      include: {
        subject: true,
        room: true,
        group: true,
        pairTime: true,
        subdivision: true,
        attendances: true,
      },
    });
  }

  async getGroups(userId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId,
      },
    });

    if (!teacher) {
      return [];
    }

    const schedules = await this.prisma.scheduleTemplate.findMany({
      where: {
        teacherId: teacher.id,
      },

      include: {
        group: true,
      },
    });

    const uniqueGroups = new Map();

    for (const schedule of schedules) {
      uniqueGroups.set(schedule.group.id, schedule.group);
    }

    return Array.from(uniqueGroups.values());
  }

  async getGroupStudents(groupId: number) {
    return this.prisma.student.findMany({
      where: {
        groupId,
      },

      include: {
        group: true,
      },

      orderBy: {
        fullName: 'asc',
      },
    });
  }

  async getStudent(studentId: number) {
    return this.prisma.student.findUnique({
      where: {
        id: studentId,
      },

      include: {
        group: true,
      },
    });
  }

  async getGroupSchedule(groupId: number) {
    return this.prisma.scheduleTemplate.findMany({
      where: {
        groupId,
      },

      include: {
        subject: true,
        room: true,
        pairTime: true,
        teacher: true,
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

  async getGroupAttendanceStatistics(groupId: number) {
    const total = await this.prisma.attendance.count({
      where: {
        student: {
          groupId,
        },
      },
    });

    const present = await this.prisma.attendance.count({
      where: {
        student: {
          groupId,
        },

        status: 'PRESENT',
      },
    });

    const absent = await this.prisma.attendance.count({
      where: {
        student: {
          groupId,
        },

        status: 'ABSENT',
      },
    });

    const late = await this.prisma.attendance.count({
      where: {
        student: {
          groupId,
        },

        status: 'LATE',
      },
    });

    return {
      total,
      present,
      absent,
      late,
    };
  }
}
