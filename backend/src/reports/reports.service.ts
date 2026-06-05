/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable, NotFoundException } from '@nestjs/common';

import * as ExcelJS from 'exceljs';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';
import { ReportFilterDto } from './dto/report-filter.dto';
import PDFDocument from 'pdfkit';
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
    worksheet.mergeCells('A1:E1');

    worksheet.getCell('A1').value = 'Attendance Report';

    worksheet.getCell('A1').font = {
      size: 16,
      bold: true,
    };

    worksheet.getCell('A1').alignment = {
      horizontal: 'center',
    };
    worksheet.views = [
      {
        state: 'frozen',
        ySplit: 1,
      },
    ];

    worksheet.autoFilter = {
      from: 'A3',
      to: 'E3',
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
    worksheet.getRow(3).height = 28;

    worksheet.getRow(3).eachCell((cell) => {
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
    let totalRecords = 0;

    for (const student of group.students) {
      for (const attendance of student.attendances) {
        totalRecords++;

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
    worksheet.addRow([]);
    worksheet.addRow(['Total Records', totalRecords]);
    return workbook.xlsx.writeBuffer();
  }
  async getDashboardStatistics() {
    const students = await this.prisma.student.count();

    const groups = await this.prisma.academicGroup.count();

    const teachers = await this.prisma.teacher.count();

    const attendances = await this.prisma.attendance.findMany();

    const present = attendances.filter(
      (a) => a.status === AttendanceStatus.PRESENT,
    ).length;

    const absent = attendances.filter(
      (a) => a.status === AttendanceStatus.ABSENT,
    ).length;

    const late = attendances.filter(
      (a) => a.status === AttendanceStatus.LATE,
    ).length;

    const attendanceRate =
      attendances.length > 0
        ? Number((((present + late) / attendances.length) * 100).toFixed(2))
        : 0;

    return {
      students,
      groups,
      teachers,
      totalAttendanceRecords: attendances.length,
      present,
      absent,
      late,
      attendanceRate,
    };
  }
  async getAttendanceReport(filters: ReportFilterDto) {
    return this.prisma.attendance.findMany({
      where: {
        createdAt: {
          gte: filters.from ? new Date(filters.from) : undefined,

          lte: filters.to ? new Date(filters.to) : undefined,
        },

        status: filters.status,

        studentId: filters.studentId,

        student: filters.groupId
          ? {
              groupId: filters.groupId,
            }
          : undefined,

        lessonSession: filters.subjectId
          ? {
              subjectId: filters.subjectId,
            }
          : undefined,
      },

      include: {
        student: {
          include: {
            group: true,
          },
        },

        lessonSession: {
          include: {
            subject: true,

            teacher: true,

            room: true,

            pairTime: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async exportGroupReportToPdf(groupId: number) {
    const group = await this.getGroupReport(groupId, {
      page: 1,
      limit: 1000,
    });

    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
    });

    const chunks: Buffer[] = [];

    return new Promise<Buffer>((resolve) => {
      doc.on('data', (chunk) => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      doc.fontSize(18);

      doc.text('Attendance Management System', {
        align: 'center',
      });

      doc.moveDown();

      doc.fontSize(14);

      doc.text(`Group Report: ${group.name}`);

      doc.text(`Generated: ${new Date().toLocaleString()}`);
      doc.text(`Group: ${group.name}`);
      doc.moveDown();

      doc.fontSize(10);
      let totalPresent = 0;
      let totalAbsent = 0;
      let totalLate = 0;
      for (const student of group.students) {
        doc.text(`Student: ${student.fullName}`);

        for (const attendance of student.attendances) {
          doc.text(
            `${attendance.lessonSession.subject.name} | ${attendance.status} | ${attendance.createdAt.toLocaleDateString()}`,
          );

          if (attendance.status === 'PRESENT') totalPresent++;

          if (attendance.status === 'ABSENT') totalAbsent++;

          if (attendance.status === 'LATE') totalLate++;
        }

        doc.moveDown();
      }

      doc.moveDown();
      doc.moveDown();

      doc.fontSize(12);

      doc.text(`Present: ${totalPresent}`);

      doc.text(`Absent: ${totalAbsent}`);

      doc.text(`Late: ${totalLate}`);
      const total = totalPresent + totalAbsent + totalLate;

      const percentage =
        total > 0
          ? (((totalPresent + totalLate) / total) * 100).toFixed(2)
          : '0';

      doc.moveDown();

      doc.text(`Attendance Percentage: ${percentage}%`);
      doc.text('Generated automatically by Attendance Management System', {
        align: 'center',
      });

      doc.end();
    });
  }

  async getAttendanceSummary(filters: ReportFilterDto) {
    const records = await this.getAttendanceReport(filters);

    const total = records.length;

    const present = records.filter((x) => x.status === 'PRESENT').length;

    const absent = records.filter((x) => x.status === 'ABSENT').length;

    const late = records.filter((x) => x.status === 'LATE').length;

    const percentage =
      total > 0 ? Number((((present + late) / total) * 100).toFixed(2)) : 0;

    return {
      filters,

      statistics: {
        total,
        present,
        absent,
        late,
        attendancePercentage: percentage,
      },

      records,
    };
  }
  async getAttendanceByGroup() {
    const groups = await this.prisma.academicGroup.findMany({
      include: {
        students: {
          include: {
            attendances: true,
          },
        },
      },
    });

    return groups.map((group) => {
      const attendances = group.students.flatMap(
        (student) => student.attendances,
      );

      const total = attendances.length;

      const present = attendances.filter((a) => a.status === 'PRESENT').length;

      const percentage =
        total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;

      return {
        groupId: group.id,
        groupName: group.name,
        total,
        percentage,
      };
    });
  }

  // =========================================
  // ДОБАВИТЬ в backend/src/reports/reports.service.ts
  // Метод exportFilteredReportToExcel
  // =========================================

  async exportFilteredReportToExcel(filters: ReportFilterDto): Promise<Buffer> {
    const records = await this.prisma.attendance.findMany({
      where: {
        lessonSession: {
          lessonDate: {
            gte: filters.from ? new Date(filters.from) : undefined,
            lte: filters.to ? new Date(filters.to) : undefined,
          },
          subjectId: filters.subjectId ?? undefined,
        },
        status: filters.status ?? undefined,
        studentId: filters.studentId ?? undefined,
        student: filters.groupId ? { groupId: filters.groupId } : undefined,
      },
      include: {
        student: {
          include: { group: true },
        },
        lessonSession: {
          include: {
            subject: true,
            teacher: true,
            room: true,
            pairTime: true,
          },
        },
      },
      orderBy: [
        { lessonSession: { lessonDate: 'desc' } },
        { student: { fullName: 'asc' } },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Attendance System';
    workbook.created = new Date();

    const ws = workbook.addWorksheet('Отчёт посещаемости');

    // ---- Шапка ----
    ws.mergeCells('A1:G1');
    const titleCell = ws.getCell('A1');
    titleCell.value = 'Отчёт посещаемости';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' },
    };
    ws.getRow(1).height = 36;

    // ---- Строка фильтров ----
    ws.mergeCells('A2:G2');
    const filtersArr: string[] = [];
    if (filters.from)
      filtersArr.push(
        `С: ${new Date(filters.from).toLocaleDateString('ru-RU')}`,
      );
    if (filters.to)
      filtersArr.push(
        `По: ${new Date(filters.to).toLocaleDateString('ru-RU')}`,
      );
    if (filters.status) {
      const statusLabels: Record<string, string> = {
        PRESENT: 'Присутствовал',
        LATE: 'Опоздал',
        ABSENT: 'Отсутствовал',
        EXCUSED: 'Уважительная',
        PENDING: 'Ожидание',
      };
      filtersArr.push(
        `Статус: ${statusLabels[filters.status] ?? filters.status}`,
      );
    }
    const filterCell = ws.getCell('A2');
    filterCell.value = filtersArr.length
      ? filtersArr.join('   |   ')
      : 'Все записи';
    filterCell.font = { size: 10, italic: true, color: { argb: 'FF888888' } };
    filterCell.alignment = { horizontal: 'center' };
    ws.getRow(2).height = 20;

    // ---- Заголовки колонок ----
    ws.columns = [
      { key: 'date', width: 14 },
      { key: 'student', width: 32 },
      { key: 'group', width: 14 },
      { key: 'subject', width: 26 },
      { key: 'teacher', width: 28 },
      { key: 'status', width: 18 },
      { key: 'checkIn', width: 18 },
    ];

    const headerRow = ws.getRow(3);
    headerRow.values = [
      'Дата',
      'Студент',
      'Группа',
      'Предмет',
      'Преподаватель',
      'Статус',
      'Время отметки',
    ];
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2D3748' },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF4A5568' } },
        bottom: { style: 'thin', color: { argb: 'FF4A5568' } },
        left: { style: 'thin', color: { argb: 'FF4A5568' } },
        right: { style: 'thin', color: { argb: 'FF4A5568' } },
      };
    });

    ws.autoFilter = { from: 'A3', to: 'G3' };
    ws.views = [{ state: 'frozen', ySplit: 3 }];

    // ---- Цветовая кодировка статусов ----
    const STATUS_FILL: Record<string, string> = {
      PRESENT: 'FFC6EFCE',
      LATE: 'FFFFEB9C',
      ABSENT: 'FFFFC7CE',
      EXCUSED: 'FFBDD7EE',
      PENDING: 'FFEDEDED',
    };
    const STATUS_LABEL: Record<string, string> = {
      PRESENT: 'Присутствовал',
      LATE: 'Опоздал',
      ABSENT: 'Отсутствовал',
      EXCUSED: 'Уважительная',
      PENDING: 'Ожидание',
    };

    // ---- Данные ----
    let rowIdx = 4;
    for (const rec of records) {
      const row = ws.getRow(rowIdx++);
      const lessonDate = new Date(rec.lessonSession.lessonDate);

      row.getCell(1).value = lessonDate.toLocaleDateString('ru-RU');
      row.getCell(2).value = rec.student.fullName;
      row.getCell(3).value = rec.student.group.name;
      row.getCell(4).value = rec.lessonSession.subject.name;
      row.getCell(5).value = rec.lessonSession.teacher.fullName;
      row.getCell(6).value = STATUS_LABEL[rec.status] ?? rec.status;
      row.getCell(7).value = rec.checkIn
        ? new Date(rec.checkIn).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '—';

      const statusFill = STATUS_FILL[rec.status] ?? 'FFFFFFFF';
      row.eachCell((cell, colNum) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: colNum === 2 ? 'left' : 'center',
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };
        if (colNum === 6) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: statusFill },
          };
          cell.font = { bold: true, size: 10 };
        }
      });
      row.height = 22;
    }

    // ---- Итоговая строка ----
    const total = records.length;
    const present = records.filter((r) => r.status === 'PRESENT').length;
    const late = records.filter((r) => r.status === 'LATE').length;
    const absent = records.filter((r) => r.status === 'ABSENT').length;
    const excused = records.filter((r) => r.status === 'EXCUSED').length;
    const rate =
      total > 0 ? (((present + late) / total) * 100).toFixed(1) : '0';

    ws.addRow([]);
    const sumRow = ws.addRow([
      `Итого: ${total} записей`,
      `Присутствовал: ${present}`,
      `Опоздал: ${late}`,
      `Отсутствовал: ${absent}`,
      `Уважительная: ${excused}`,
      `Посещаемость: ${rate}%`,
      `Сформировано: ${new Date().toLocaleString('ru-RU')}`,
    ]);
    sumRow.eachCell((cell) => {
      cell.font = { bold: true, size: 10 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEBF0F7' },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
  }
}
