import { Injectable, NotFoundException } from '@nestjs/common';

import * as ExcelJS from 'exceljs';
import { PaginationDto } from '../common/dto/pagination.dto';
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

  async getGroupReport(
    groupId: number,
    paginationDto: PaginationDto,
    from?: string,
    to?: string,
  ) {
    const page = paginationDto.page ?? 1;

    const limit = paginationDto.limit ?? 20;

    const skip = (page - 1) * limit;
    const group = await this.prisma.academicGroup.findUnique({
      where: {
        id: groupId,
      },

      include: {
        students: {
          skip,

          take: limit,
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

  async getSubjectReport(
    subjectId: number,
    paginationDto: PaginationDto,
    from?: string,
    to?: string,
  ) {
    const page = paginationDto.page ?? 1;

    const limit = paginationDto.limit ?? 20;

    const skip = (page - 1) * limit;

    return this.prisma.lessonSession.findMany({
      where: {
        subjectId,

        lessonDate: {
          gte: from ? new Date(from) : undefined,

          lte: to ? new Date(to) : undefined,
        },
      },

      skip,

      take: limit,

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

  async getTeacherReport(
    teacherId: number,
    paginationDto: PaginationDto,
    from?: string,
    to?: string,
  ) {
    const page = paginationDto.page ?? 1;

    const limit = paginationDto.limit ?? 20;

    const skip = (page - 1) * limit;
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },

      include: {
        sessions: {
          skip,
          take: limit,
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
    const group = await this.getGroupReport(groupId, {
      page: 1,
      limit: 1000,
    });

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Attendance Report');

    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
      },
    ];

    worksheet.autoFilter = {
      from: 'A1',
      to: 'E1',
    };
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
    worksheet.getRow(1).height = 28;

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = {
        bold: true,
        color: {
          argb: 'FFFFFFFF',
        },
        size: 12,
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: '1F4E78',
        },
      };

      cell.border = {
        top: {
          style: 'thin',
        },
        left: {
          style: 'thin',
        },
        bottom: {
          style: 'thin',
        },
        right: {
          style: 'thin',
        },
      };
    });
    for (const student of group.students) {
      for (const attendance of student.attendances) {
        const row = worksheet.addRow({
          student: student.fullName,

          subject: attendance.lessonSession.subject.name,

          teacher: attendance.lessonSession.teacher.fullName,

          status: attendance.status,

          checkIn: attendance.checkIn,
        });
        row.eachCell((cell) => {
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'left',
          };
          const statusCell = row.getCell(4);

          if (attendance.status === 'PRESENT') {
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: 'C6EFCE',
              },
            };
          }

          if (attendance.status === 'ABSENT') {
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: 'FFC7CE',
              },
            };
          }

          if (attendance.status === 'LATE') {
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: 'FFEB9C',
              },
            };
          }
          cell.border = {
            top: {
              style: 'thin',
            },
            left: {
              style: 'thin',
            },
            bottom: {
              style: 'thin',
            },
            right: {
              style: 'thin',
            },
          };
        });
      }
    }

    return workbook.xlsx.writeBuffer();
  }
}
