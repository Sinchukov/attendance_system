import { Module } from '@nestjs/common';
import { LessonSessionsModule } from './lesson-sessions/lesson-sessions.module';
import { PrismaModule } from './prisma/prisma.module';
import { PairTimesModule } from './pair-times/pair-times.module';
import { AcademicGroupsModule } from './academic-groups/academic-groups.module';
import { StudentsModule } from './students/students.module';
import { RoomsModule } from './rooms/rooms.module';
import { DevicesModule } from './devices/devices.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectSubdivisionsModule } from './subject-subdivisions/subject-subdivisions.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ScheduleTemplatesModule } from './schedule-templates/schedule-templates.module';
import { SubjectSubdivisionStudentsModule } from './subject-subdivision-students/subject-subdivision-students.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    PrismaModule,
    PairTimesModule,
    LessonSessionsModule,
    AcademicGroupsModule,
    StudentsModule,
    ReportsModule,
    RoomsModule,
    DevicesModule,
    AuthModule,
    SubjectsModule,
    TeachersModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    SubjectSubdivisionsModule,
    AttendanceModule,
    ScheduleTemplatesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SubjectSubdivisionStudentsModule,
  ],
})
export class AppModule {}
