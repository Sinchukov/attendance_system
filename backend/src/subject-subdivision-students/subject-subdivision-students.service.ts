import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateSubdivisionStudentDto } from './dto/create-subdivision-student.dto';

@Injectable()
export class SubjectSubdivisionStudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubdivisionStudentDto) {
    return this.prisma.subjectSubdivisionStudent.create({
      data: {
        subdivisionId: dto.subdivisionId,
        studentId: dto.studentId,
      },

      include: {
        subdivision: true,
        student: true,
      },
    });
  }

  async findAll() {
    return this.prisma.subjectSubdivisionStudent.findMany({
      include: {
        subdivision: {
          include: {
            subject: true,
            group: true,
          },
        },

        student: true,
      },
    });
  }
}
