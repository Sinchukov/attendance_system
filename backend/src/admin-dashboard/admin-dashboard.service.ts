import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}
  async changeUserPassword(userId: number, password: string) {
    const hash = await bcrypt.hash(password, 10);

    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password: hash,
      },
    });
  }
  async deactivateUser(userId: number) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        isActive: false,
      },
    });
  }
  async getKpiDashboard() {
    const totalStudents = await this.prisma.student.count();

    const totalTeachers = await this.prisma.teacher.count();

    const totalAttendances = await this.prisma.attendance.count();

    const present = await this.prisma.attendance.count({
      where: {
        status: 'PRESENT',
      },
    });

    const absent = await this.prisma.attendance.count({
      where: {
        status: 'ABSENT',
      },
    });

    const late = await this.prisma.attendance.count({
      where: {
        status: 'LATE',
      },
    });

    const attendancePercent =
      totalAttendances > 0
        ? Number((((present + late) / totalAttendances) * 100).toFixed(2))
        : 0;

    return {
      totalStudents,
      totalTeachers,
      totalAttendances,
      present,
      absent,
      late,
      attendancePercent,
    };
  }
  async activateUser(userId: number) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        isActive: true,
      },
    });
  }

  async getRecentAttendanceChanges() {
    return this.prisma.attendanceChangeLog.findMany({
      take: 100,

      orderBy: {
        createdAt: 'desc',
      },

      include: {
        teacher: true,

        attendance: {
          include: {
            student: true,

            lessonSession: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });
  }
  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async getSystemActivity() {
    return {
      students: await this.prisma.student.count(),

      teachers: await this.prisma.teacher.count(),

      sessions: await this.prisma.lessonSession.count(),

      attendances: await this.prisma.attendance.count(),

      attendanceLogs: await this.prisma.attendanceChangeLog.count(),
    };
  }

  async getStatistics() {
    const students = await this.prisma.student.count();

    const teachers = await this.prisma.teacher.count();

    const groups = await this.prisma.academicGroup.count();

    const subjects = await this.prisma.subject.count();

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

    const todaySessions = await this.prisma.lessonSession.count({
      where: {
        lessonDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const todayAttendances = await this.prisma.attendance.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const present = await this.prisma.attendance.count({
      where: {
        status: 'PRESENT',
      },
    });

    const absent = await this.prisma.attendance.count({
      where: {
        status: 'ABSENT',
      },
    });

    const late = await this.prisma.attendance.count({
      where: {
        status: 'LATE',
      },
    });

    return {
      students,
      teachers,
      groups,
      subjects,
      todaySessions,
      todayAttendances,
      present,
      absent,
      late,
    };
  }
  async getAttendanceStatistics() {
    const present = await this.prisma.attendance.count({
      where: {
        status: 'PRESENT',
      },
    });

    const absent = await this.prisma.attendance.count({
      where: {
        status: 'ABSENT',
      },
    });

    const late = await this.prisma.attendance.count({
      where: {
        status: 'LATE',
      },
    });

    return {
      present,
      absent,
      late,
    };
  }
  async getTopAbsentStudents() {
    const students = await this.prisma.student.findMany({
      include: {
        group: true,

        attendances: {
          where: {
            status: 'ABSENT',
          },
        },
      },
    });

    return students
      .map((student) => ({
        id: student.id,

        fullName: student.fullName,

        group: student.group,

        absentCount: student.attendances.length,
      }))
      .sort((a, b) => b.absentCount - a.absentCount)
      .slice(0, 20);
  }
  async getTopGroups() {
    const groups = await this.prisma.academicGroup.findMany({
      include: {
        students: {
          include: {
            attendances: true,
          },
        },
      },
    });

    return groups
      .map((group) => {
        let total = 0;

        let present = 0;

        for (const student of group.students) {
          total += student.attendances.length;

          present += student.attendances.filter(
            (a) => a.status === 'PRESENT',
          ).length;
        }

        return {
          id: group.id,

          name: group.name,

          totalAttendances: total,

          presentAttendances: present,

          attendancePercent:
            total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0,
        };
      })
      .sort((a, b) => b.attendancePercent - a.attendancePercent);
  }

  async getUpcomingSessions() {
    return this.prisma.lessonSession.findMany({
      where: {
        lessonDate: {
          gte: new Date(),
        },
      },

      take: 20,

      include: {
        subject: true,
        teacher: true,
        group: true,
        room: true,
        pairTime: true,
      },

      orderBy: {
        lessonDate: 'asc',
      },
    });
  }

  async getAttendanceAuditLogs() {
    return this.prisma.attendanceChangeLog.findMany({
      include: {
        teacher: true,

        attendance: {
          include: {
            student: true,

            lessonSession: {
              include: {
                subject: true,

                group: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 500,
    });
  }

  async getAttendanceAuditLog(id: number) {
    return this.prisma.attendanceChangeLog.findUnique({
      where: {
        id,
      },

      include: {
        teacher: true,

        attendance: {
          include: {
            student: true,

            lessonSession: {
              include: {
                subject: true,

                group: true,
              },
            },
          },
        },
      },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async getUser(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
  async getTeachers() {
    return this.prisma.teacher.findMany({
      include: {
        user: true,
      },

      orderBy: {
        fullName: 'asc',
      },
    });
  }
  async getStudents() {
    return this.prisma.student.findMany({
      include: {
        group: true,
      },

      orderBy: {
        fullName: 'asc',
      },
    });
  }
  async getGroups() {
    return this.prisma.academicGroup.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
  async getSubjects() {
    return this.prisma.subject.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getRooms() {
    return this.prisma.room.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getDevices() {
    return this.prisma.device.findMany({
      include: {
        room: true,
      },
    });
  }

  async getFullSchedule() {
    return this.prisma.scheduleTemplate.findMany({
      include: {
        subject: true,

        teacher: true,

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
}
