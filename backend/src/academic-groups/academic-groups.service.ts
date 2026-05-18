import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAcademicGroupDto } from './dto/create-academic-group.dto';
import { UpdateAcademicGroupDto } from './dto/update-academic-group.dto';

@Injectable()
export class AcademicGroupsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAcademicGroupDto) {
    return this.prisma.academicGroup.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.academicGroup.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.academicGroup.findUnique({
      where: { id },
    });
  }

  update(id: number, dto: UpdateAcademicGroupDto) {
    return this.prisma.academicGroup.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.academicGroup.delete({
      where: { id },
    });
  }
}
