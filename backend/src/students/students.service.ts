import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuditService } from '../audit/audit.service';
@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(dto: CreateStudentDto) {
    const student = await this.prisma.student.create({
      data: dto,
    });

    await this.auditService.createLog(
      'CREATE',
      'Student',
      student.id,
      undefined,
      undefined,
      student,
    );

    return student;
  }

  findAll() {
    return this.prisma.student.findMany({
      include: {
        group: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        group: true,
      },
    });
  }

  async update(id: number, dto: UpdateStudentDto) {
    const oldStudent = await this.prisma.student.findUnique({
      where: { id },
    });

    const updatedStudent = await this.prisma.student.update({
      where: { id },
      data: dto,
    });

    await this.auditService.createLog(
      'UPDATE',
      'Student',
      id,
      undefined,
      oldStudent,
      updatedStudent,
    );

    return updatedStudent;
  }

  async remove(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    await this.auditService.createLog(
      'DELETE',
      'Student',
      id,
      undefined,
      student,
      undefined,
    );

    return this.prisma.student.delete({
      where: { id },
    });
  }

  findByCard(studentCardNo: string) {
    return this.prisma.student.findUnique({
      where: { studentCardNo },
      include: {
        group: true,
      },
    });
  }
}
