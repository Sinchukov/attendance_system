/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const students = await this.prisma.student.count();

    const teachers = await this.prisma.teacher.count();

    const groups = await this.prisma.academicGroup.count();

    const attendance = await this.prisma.attendance.count();

    const presentAttendance = await this.prisma.attendance.count({
      where: {
        status: {
          in: ['PRESENT', 'LATE'],
        },
      },
    });

    const attendancePercent =
      attendance === 0
        ? 0
        : Number(((presentAttendance / attendance) * 100).toFixed(2));

    return {
      students,
      teachers,
      groups,
      attendanceRecords: attendance,
      attendancePercent,
    };
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

  async getTopTeachers() {
    const teachers = await this.prisma.teacher.findMany({
      include: {
        sessions: {
          include: {
            attendances: true,
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
  async getRiskStudents() {
    const students = await this.prisma.student.findMany({
      include: {
        attendances: true,
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

  async getSubjectsAnalytics() {
    const subjects = await this.prisma.subject.findMany({
      include: {
        sessions: {
          include: {
            attendances: true,
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

  async getMonthlyAnalytics() {
    const attendances = await this.prisma.attendance.findMany({
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
}
