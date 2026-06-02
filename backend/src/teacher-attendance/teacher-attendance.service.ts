import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateAttendanceStatusDto } from './dto/update-attendance-status.dto';

import { UpdateAttendanceCommentDto } from './dto/update-attendance-comment.dto';

@Injectable()
export class TeacherAttendanceService {
  constructor(private prisma: PrismaService) {}
  private async getTeacherIdFromUser(userId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher.id;
  }
  async getSessionAttendance(sessionId: number) {
    return this.prisma.attendance.findMany({
      where: {
        lessonSessionId: sessionId,
      },

      include: {
        student: true,

        lessonSession: {
          include: {
            subject: true,
            group: true,
            pairTime: true,
          },
        },
      },

      orderBy: {
        student: {
          fullName: 'asc',
        },
      },
    });
  }

  async getStudentAttendance(studentId: number) {
    return this.prisma.attendance.findMany({
      where: {
        studentId,
      },

      include: {
        lessonSession: {
          include: {
            subject: true,
            pairTime: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getStudentHistory(studentId: number) {
    return this.prisma.attendanceChangeLog.findMany({
      where: {
        attendance: {
          studentId,
        },
      },

      include: {
        teacher: true,

        attendance: {
          include: {
            lessonSession: {
              include: {
                subject: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSessionHistory(sessionId: number) {
    return this.prisma.attendanceChangeLog.findMany({
      where: {
        attendance: {
          lessonSessionId: sessionId,
        },
      },

      include: {
        teacher: true,

        attendance: {
          include: {
            student: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async updateStatus(
    attendanceId: number,
    dto: UpdateAttendanceStatusDto,
    teacherId: number,
  ) {
    const currentAttendance = await this.prisma.attendance.findUnique({
      where: {
        id: attendanceId,
      },
    });

    if (!currentAttendance) {
      throw new NotFoundException('Attendance not found');
    }

    const attendance = await this.prisma.attendance.update({
      where: {
        id: attendanceId,
      },

      data: {
        status: dto.status,
        isManualEdited: true,
      },
    });

    await this.prisma.attendanceChangeLog.create({
      data: {
        attendanceId,

        teacherId,

        oldStatus: currentAttendance.status,

        newStatus: dto.status,

        action: 'MANUAL_STATUS_CHANGE',

        details: null,
      },
    });

    return attendance;
  }

  async updateComment(
    attendanceId: number,
    dto: UpdateAttendanceCommentDto,
    teacherId: number,
  ) {
    const attendance = await this.prisma.attendance.update({
      where: {
        id: attendanceId,
      },

      data: {
        comment: dto.comment,
        isManualEdited: true,
      },
    });

    await this.prisma.attendanceChangeLog.create({
      data: {
        attendanceId,

        teacherId,

        newStatus: attendance.status,

        action: 'COMMENT_UPDATED',

        details: dto.comment,
      },
    });

    return attendance;
  }
}
