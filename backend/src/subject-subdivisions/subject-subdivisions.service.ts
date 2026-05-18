import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateSubjectSubdivisionDto } from './dto/create-subject-subdivision.dto';

@Injectable()
export class SubjectSubdivisionsService {
  constructor(private prisma: PrismaService) {}

  // СОЗДАТЬ ПОДГРУППУ
  async create(dto: CreateSubjectSubdivisionDto) {
    return this.prisma.subjectSubdivision.create({
      data: {
        name: dto.name,

        subjectId: dto.subjectId,

        groupId: dto.groupId,
      },

      include: {
        subject: true,
        group: true,
      },
    });
  }

  // ДОБАВИТЬ СТУДЕНТОВ В ПОДГРУППУ
  async addStudents(subdivisionId: number, studentIds: number[]) {
    return this.prisma.subjectSubdivisionStudent.createMany({
      data: studentIds.map((studentId) => ({
        subdivisionId,
        studentId,
      })),

      skipDuplicates: true,
    });
  }

  // ВСЕ ПОДГРУППЫ
  async findAll() {
    return this.prisma.subjectSubdivision.findMany({
      include: {
        subject: true,

        group: true,

        students: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  // ПОДГРУППЫ КОНКРЕТНОЙ ГРУППЫ
  async findByGroup(groupId: number) {
    return this.prisma.subjectSubdivision.findMany({
      where: {
        groupId,
      },

      include: {
        subject: true,

        students: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  // ПОДГРУППЫ КОНКРЕТНОГО ПРЕДМЕТА
  async findBySubject(subjectId: number) {
    return this.prisma.subjectSubdivision.findMany({
      where: {
        subjectId,
      },

      include: {
        group: true,

        students: {
          include: {
            student: true,
          },
        },
      },
    });
  }
}
