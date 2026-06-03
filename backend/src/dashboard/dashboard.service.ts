/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview(filter: DashboardFilterDto) {
    const where = this.buildAttendanceWhere(filter);

    const totalAttendance = await this.prisma.attendance.count({
      where,
    });

    const presentAttendance = await this.prisma.attendance.count({
      where: {
        ...where,

        status: {
          in: ['PRESENT', 'LATE'],
        },
      },
    });

    const students = await this.prisma.student.count();

    const teachers = await this.prisma.teacher.count();

    const groups = await this.prisma.academicGroup.count();

    return {
      students,
      teachers,
      groups,
      attendanceRecords: totalAttendance,

      attendancePercent:
        totalAttendance === 0
          ? 0
          : Number(((presentAttendance / totalAttendance) * 100).toFixed(2)),
    };
  }
  private buildAttendanceWhere(filter: DashboardFilterDto) {
    return {
      lessonSession: {
        ...(filter.groupId && {
          groupId: filter.groupId,
        }),

        ...(filter.teacherId && {
          teacherId: filter.teacherId,
        }),

        ...(filter.subjectId && {
          subjectId: filter.subjectId,
        }),

        ...(filter.startDate || filter.endDate
          ? {
              lessonDate: {
                ...(filter.startDate && {
                  gte: new Date(filter.startDate),
                }),

                ...(filter.endDate && {
                  lte: new Date(filter.endDate),
                }),
              },
            }
          : {}),
      },
    };
  }
  async getTopGroups(filter: DashboardFilterDto) {
    const groups = await this.prisma.academicGroup.findMany({
      include: {
        students: {
          include: {
            attendances: {
              where: this.buildAttendanceWhere(filter),
            },
          },
        },
      },
    });

    return groups
      .map((group) => {
        let total = 0;
        let present = 0;

        group.students.forEach((student) => {
          student.attendances.forEach((attendance) => {
            total++;

            if (
              attendance.status === 'PRESENT' ||
              attendance.status === 'LATE'
            ) {
              present++;
            }
          });
        });

        return {
          id: group.id,
          name: group.name,
          attendancePercent:
            total === 0 ? 0 : Number(((present / total) * 100).toFixed(2)),
        };
      })
      .sort((a, b) => b.attendancePercent - a.attendancePercent)
      .slice(0, 10);
  }

  async getTopTeachers(filter: DashboardFilterDto) {
    const teachers = await this.prisma.teacher.findMany({
      include: {
        sessions: {
          include: {
            attendances: {
              where: this.buildAttendanceWhere(filter),
            },
          },
        },
      },
    });

    return teachers
      .map((teacher) => {
        let total = 0;
        let present = 0;

        teacher.sessions.forEach((session) => {
          session.attendances.forEach((attendance) => {
            total++;

            if (
              attendance.status === 'PRESENT' ||
              attendance.status === 'LATE'
            ) {
              present++;
            }
          });
        });

        return {
          id: teacher.id,
          fullName: teacher.fullName,
          attendancePercent:
            total === 0 ? 0 : Number(((present / total) * 100).toFixed(2)),
        };
      })
      .sort((a, b) => b.attendancePercent - a.attendancePercent)
      .slice(0, 10);
  }
  async getRiskStudents(filter: DashboardFilterDto) {
    const students = await this.prisma.student.findMany({
      include: {
        attendances: {
          where: this.buildAttendanceWhere(filter),
        },
      },
    });

    return students
      .map((student) => {
        const total = student.attendances.length;

        const present = student.attendances.filter(
          (a) => a.status === 'PRESENT' || a.status === 'LATE',
        ).length;

        const percent = total === 0 ? 0 : (present / total) * 100;

        return {
          id: student.id,
          fullName: student.fullName,
          attendancePercent: Number(percent.toFixed(2)),
        };
      })
      .filter((student) => student.attendancePercent < 50)
      .sort((a, b) => a.attendancePercent - b.attendancePercent);
  }

  async getSubjectsAnalytics(filter: DashboardFilterDto) {
    const subjects = await this.prisma.subject.findMany({
      include: {
        sessions: {
          include: {
            attendances: {
              where: this.buildAttendanceWhere(filter),
            },
          },
        },
      },
    });

    return subjects
      .map((subject) => {
        let total = 0;
        let present = 0;

        subject.sessions.forEach((session) => {
          session.attendances.forEach((attendance) => {
            total++;

            if (
              attendance.status === 'PRESENT' ||
              attendance.status === 'LATE'
            ) {
              present++;
            }
          });
        });

        return {
          id: subject.id,
          name: subject.name,
          totalRecords: total,
          attendancePercent:
            total === 0 ? 0 : Number(((present / total) * 100).toFixed(2)),
        };
      })
      .sort((a, b) => a.attendancePercent - b.attendancePercent);
  }

  async getMonthlyAnalytics(filter: DashboardFilterDto) {
    const attendances = await this.prisma.attendance.findMany({
      where: this.buildAttendanceWhere(filter),

      select: {
        status: true,
        createdAt: true,
      },
    });

    const months = {};

    attendances.forEach((attendance) => {
      const month = attendance.createdAt.toISOString().slice(0, 7);

      if (!months[month]) {
        months[month] = {
          total: 0,
          present: 0,
        };
      }

      months[month].total++;

      if (attendance.status === 'PRESENT' || attendance.status === 'LATE') {
        months[month].present++;
      }
    });

    return Object.entries(months).map(([month, value]: any) => ({
      month,

      attendancePercent:
        value.total === 0
          ? 0
          : Number(((value.present / value.total) * 100).toFixed(2)),
    }));
  }

  async getLateAnalytics() {
    const total = await this.prisma.attendance.count();

    const late = await this.prisma.attendance.count({
      where: {
        status: 'LATE',
      },
    });

    return {
      totalAttendance: total,
      lateAttendance: late,

      latePercent: total === 0 ? 0 : Number(((late / total) * 100).toFixed(2)),
    };
  }

  async getWeekdayAnalytics() {
    const sessions = await this.prisma.lessonSession.findMany({
      include: {
        attendances: true,
      },
    });

    const stats = {
      MONDAY: { total: 0, present: 0 },
      TUESDAY: { total: 0, present: 0 },
      WEDNESDAY: { total: 0, present: 0 },
      THURSDAY: { total: 0, present: 0 },
      FRIDAY: { total: 0, present: 0 },
      SATURDAY: { total: 0, present: 0 },
    };

    sessions.forEach((session) => {
      const weekday = session.lessonDate
        .toLocaleDateString('en-US', {
          weekday: 'long',
        })
        .toUpperCase();

      if (!stats[weekday]) {
        return;
      }

      session.attendances.forEach((attendance) => {
        stats[weekday].total++;

        if (attendance.status === 'PRESENT' || attendance.status === 'LATE') {
          stats[weekday].present++;
        }
      });
    });

    return Object.entries(stats).map(([weekday, value]) => ({
      weekday,

      attendancePercent:
        value.total === 0
          ? 0
          : Number(((value.present / value.total) * 100).toFixed(2)),
    }));
  }

  async getTopAbsentStudents() {
    const students = await this.prisma.student.findMany({
      include: {
        attendances: true,
      },
    });

    return students
      .map((student) => ({
        id: student.id,
        fullName: student.fullName,

        absences: student.attendances.filter((a) => a.status === 'ABSENT')
          .length,
      }))
      .sort((a, b) => b.absences - a.absences)
      .slice(0, 20);
  }

  async getAttendanceChangesStatistics() {
    const totalChanges = await this.prisma.attendanceChangeLog.count();

    const teacherChanges = await this.prisma.attendanceChangeLog.count({
      where: {
        teacherId: {
          not: null,
        },
      },
    });

    const deviceChanges = await this.prisma.attendanceChangeLog.count({
      where: {
        deviceId: {
          not: null,
        },
      },
    });

    return {
      totalChanges,
      teacherChanges,
      deviceChanges,
    };
  }
  async getTeacherModificationRanking() {
    const teachers = await this.prisma.teacher.findMany({
      include: {
        attendanceLogs: true,
      },
    });

    return teachers
      .map((teacher) => ({
        id: teacher.id,
        fullName: teacher.fullName,
        changes: teacher.attendanceLogs.length,
      }))
      .sort((a, b) => b.changes - a.changes);
  }

  async getDeviceAnalytics() {
    const devices = await this.prisma.device.findMany({
      include: {
        auditLogs: true,
        room: true,
      },
    });

    return devices.map((device) => ({
      id: device.id,
      serialNumber: device.serialNumber,
      room: device.room.name,
      events: device.auditLogs.length,
    }));
  }

  async getAttendanceAuditStatistics() {
    const logs = await this.prisma.attendanceAuditLog.findMany();

    const result = {};

    logs.forEach((log) => {
      result[log.eventType] = (result[log.eventType] || 0) + 1;
    });

    return result;
  }

  async getTerminalSuccessRate() {
    const logs = await this.prisma.attendanceAuditLog.findMany();

    const success = logs.filter(
      (x) => x.eventType === 'CHECK_IN_SUCCESS',
    ).length;

    const total = logs.length;

    return {
      success,
      total,

      successRate:
        total === 0 ? 0 : Number(((success / total) * 100).toFixed(2)),
    };
  }
  async getCancelledLessonsStatistics() {
    const total = await this.prisma.lessonSession.count();

    const cancelled = await this.prisma.lessonSession.count({
      where: {
        isCancelled: true,
      },
    });

    return {
      total,
      cancelled,

      cancelledPercent:
        total === 0 ? 0 : Number(((cancelled / total) * 100).toFixed(2)),
    };
  }
}
