import { Module } from '@nestjs/common';

import { TeacherAttendanceController } from './teacher-attendance.controller';

import { TeacherAttendanceService } from './teacher-attendance.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [TeacherAttendanceController],

  providers: [TeacherAttendanceService],
})
export class TeacherAttendanceModule {}
