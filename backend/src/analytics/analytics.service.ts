/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

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
          groupId: group.id,
          groupName: group.name,
          attendancePercent:
            total === 0 ? 0 : Number(((present / total) * 100).toFixed(2)),
        };
      })
      .sort((a, b) => b.attendancePercent - a.attendancePercent);
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

    return teachers.map((teacher) => {
      let total = 0;
      let present = 0;

      teacher.sessions.forEach((session) => {
        session.attendances.forEach((attendance) => {
          total++;

          if (attendance.status === 'PRESENT' || attendance.status === 'LATE') {
            present++;
          }
        });
      });

      return {
        teacherId: teacher.id,
        teacherName: teacher.fullName,
        attendancePercent:
          total === 0 ? 0 : Number(((present / total) * 100).toFixed(2)),
      };
    });
  }
  async getRiskStudents() {
    const students = await this.prisma.student.findMany({
      include: {
        attendances: true,
        group: true,
      },
    });

    return students
      .map((student) => {
        const total = student.attendances.length;

        const absent = student.attendances.filter(
          (a) => a.status === 'ABSENT',
        ).length;

        const riskPercent =
          total === 0 ? 0 : Number(((absent / total) * 100).toFixed(2));

        return {
          studentId: student.id,
          fullName: student.fullName,
          group: student.group.name,
          riskPercent,
        };
      })
      .filter((student) => student.riskPercent >= 30)
      .sort((a, b) => b.riskPercent - a.riskPercent);
  }

  async getMonthlyAttendance() {
    const attendances = await this.prisma.attendance.findMany({
      include: {
        lessonSession: true,
      },
    });

    const result = {};

    attendances.forEach((attendance) => {
      const month = attendance.lessonSession.lessonDate.toLocaleString(
        'default',
        {
          month: 'long',
        },
      );

      if (!result[month]) {
        result[month] = {
          total: 0,
          present: 0,
        };
      }

      result[month].total++;

      if (attendance.status === 'PRESENT' || attendance.status === 'LATE') {
        result[month].present++;
      }
    });

    return Object.entries(result).map(([month, value]: any) => ({
      month,
      attendancePercent: Number(
        ((value.present / value.total) * 100).toFixed(2),
      ),
    }));
  }
}
