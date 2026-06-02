import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KpiService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const students = await this.prisma.student.count();

    const teachers = await this.prisma.teacher.count();

    const groups = await this.prisma.academicGroup.count();

    const subjects = await this.prisma.subject.count();

    const attendances = await this.prisma.attendance.findMany();

    const present = attendances.filter((x) => x.status === 'PRESENT').length;

    const late = attendances.filter((x) => x.status === 'LATE').length;

    const absent = attendances.filter((x) => x.status === 'ABSENT').length;

    const total = attendances.length;

    return {
      students,
      teachers,
      groups,
      subjects,

      totalAttendances: total,

      attendanceRate:
        total > 0 ? Number((((present + late) / total) * 100).toFixed(2)) : 0,

      absenceRate: total > 0 ? Number(((absent / total) * 100).toFixed(2)) : 0,

      lateRate: total > 0 ? Number(((late / total) * 100).toFixed(2)) : 0,
    };
  }
}
