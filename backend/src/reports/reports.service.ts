import { Injectable, NotFoundException } from '@nestjs/common';

import * as ExcelJS from 'exceljs';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // =========================================
  // STUDENT REPORT
  // =========================================

  async getStudentReport(studentId: number, from?: string, to?: string) {
    const student = await this.prisma.student.findUnique({
      where: {
        id: studentId,
      },

      include: {
        group: true,

        attendances: {
          where: {
            createdAt: {
              gte: from ? new Date(from) : undefined,

              lte: to ? new Date(to) : undefined,
            },
          },

          include: {
            lessonSession: {
              include: {
                subject: true,

                teacher: true,

                pairTime: true,
              },
            },
          },

          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Студент не найден');
    }

    return student;
  }

  // =========================================
  // GROUP REPORT
  // =========================================

  async getGroupReport(groupId: number, from?: string, to?: string) {
    const group = await this.prisma.academicGroup.findUnique({
      where: {
        id: groupId,
      },

      include: {
        students: {
          include: {
            attendances: {
              where: {
                createdAt: {
                  gte: from ? new Date(from) : undefined,

                  lte: to ? new Date(to) : undefined,
                },
              },

              include: {
                lessonSession: {
                  include: {
                    subject: true,

                    teacher: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Группа не найдена');
    }

    return group;
  }

  // =========================================
  // SUBJECT REPORT
  // =========================================

  async getSubjectReport(subjectId: number, from?: string, to?: string) {
    return this.prisma.lessonSession.findMany({
      where: {
        subjectId,

        lessonDate: {
          gte: from ? new Date(from) : undefined,

          lte: to ? new Date(to) : undefined,
        },
      },

      include: {
        subject: true,

        teacher: true,

        group: true,

        attendances: {
          include: {
            student: true,
          },
        },
      },

      orderBy: {
        lessonDate: 'desc',
      },
    });
  }

  // =========================================
  // SESSION REPORT
  // =========================================

  async getSessionReport(sessionId: number) {
    const session = await this.prisma.lessonSession.findUnique({
      where: {
        id: sessionId,
      },

      include: {
        subject: true,

        teacher: true,

        group: true,

        room: true,

        pairTime: true,

        attendances: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Пара не найдена');
    }

    return session;
  }

  // =========================================
  // TEACHER REPORT
  // =========================================

  async getTeacherReport(teacherId: number, from?: string, to?: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },

      include: {
        sessions: {
          where: {
            lessonDate: {
              gte: from ? new Date(from) : undefined,

              lte: to ? new Date(to) : undefined,
            },
          },

          include: {
            subject: true,

            group: true,

            attendances: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Преподаватель не найден');
    }

    return teacher;
  }

  // =========================================
  // STUDENT STATS
  // =========================================

  async getStudentStats(studentId: number) {
    const attendances = await this.prisma.attendance.findMany({
      where: {
        studentId,
      },
    });

    const present = attendances.filter((a) => a.status === 'PRESENT').length;

    const late = attendances.filter((a) => a.status === 'LATE').length;

    const absent = attendances.filter((a) => a.status === 'ABSENT').length;

    return {
      total: attendances.length,

      present,

      late,

      absent,

      attendancePercentage:
        attendances.length > 0
          ? (((present + late) / attendances.length) * 100).toFixed(2)
          : '0',
    };
  }

  // =========================================
  // EXCEL EXPORT
  // =========================================

  async exportGroupReportToExcel(groupId: number) {
    const group = await this.getGroupReport(groupId);

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Attendance Report');

    worksheet.columns = [
      {
        header: 'Student',
        key: 'student',
        width: 30,
      },
      {
        header: 'Subject',
        key: 'subject',
        width: 30,
      },
      {
        header: 'Teacher',
        key: 'teacher',
        width: 30,
      },
      {
        header: 'Status',
        key: 'status',
        width: 15,
      },
      {
        header: 'Check In',
        key: 'checkIn',
        width: 25,
      },
    ];

    for (const student of group.students) {
      for (const attendance of student.attendances) {
        worksheet.addRow({
          student: student.fullName,

          subject: attendance.lessonSession.subject.name,

          teacher: attendance.lessonSession.teacher.fullName,

          status: attendance.status,

          checkIn: attendance.checkIn,
        });
      }
    }

    return workbook.xlsx.writeBuffer();
  }
}
