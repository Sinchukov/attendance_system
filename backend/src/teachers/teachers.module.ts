import { Module } from '@nestjs/common';

import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';

import { PrismaModule } from '../prisma/prisma.module';
import { TeachersScheduleController } from './teachers.schedule.controller';
@Module({
  imports: [PrismaModule],
  controllers: [TeachersController, TeachersScheduleController],
  providers: [TeachersService],
})
export class TeachersModule {}
