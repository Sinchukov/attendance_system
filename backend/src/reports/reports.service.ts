import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // =========================================
  // STUDENT REPORT
  // =========================================

  async getStudentReport(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: {
        id: studentId,
      },

      include: {
        group: true,

        attendances: {
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

  async getGroupReport(groupId: number) {
    const group = await this.prisma.academicGroup.findUnique({
      where: {
        id: groupId,
      },

      include: {
        students: {
          include: {
            attendances: true,
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

  async getSubjectReport(subjectId: number) {
    return this.prisma.lessonSession.findMany({
      where: {
        subjectId,
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

  async getTeacherReport(teacherId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },

      include: {
        sessions: {
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
}
