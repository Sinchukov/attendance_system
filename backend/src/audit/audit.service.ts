/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async createLog(
    action: string,
    entityType: string,
    entityId?: number,
    userId?: number,
    oldValue?: any,
    newValue?: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId,
        oldValue,
        newValue,
      },
    });
  }

  async findAll() {
    return this.prisma.auditLog.findMany({
      include: {
        user: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.auditLog.findUnique({
      where: {
        id,
      },

      include: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.auditLog.delete({
      where: {
        id,
      },
    });
  }
}
