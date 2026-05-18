import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateStudentDto) {
    return this.prisma.student.create({
      data: dto,
    });
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

  update(id: number, dto: UpdateStudentDto) {
    return this.prisma.student.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
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
