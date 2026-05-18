import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreatePairTimeDto } from './dto/create-pair-time.dto';
import { UpdatePairTimeDto } from './dto/update-pair-time.dto';

@Injectable()
export class PairTimesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePairTimeDto) {
    return this.prisma.pairTime.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.pairTime.findMany({
      orderBy: {
        pairNumber: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.pairTime.findUnique({
      where: { id },
    });
  }

  update(id: number, dto: UpdatePairTimeDto) {
    return this.prisma.pairTime.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.pairTime.delete({
      where: { id },
    });
  }
}
