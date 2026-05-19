import { Module } from '@nestjs/common';
import { LessonSessionsModule } from './lesson-sessions/lesson-sessions.module';
import { PrismaModule } from './prisma/prisma.module';
import { PairTimesModule } from './pair-times/pair-times.module';
import { AcademicGroupsModule } from './academic-groups/academic-groups.module';
import { StudentsModule } from './students/students.module';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomsModule } from './rooms/rooms.module';
import { DevicesModule } from './devices/devices.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectSubdivisionsModule } from './subject-subdivisions/subject-subdivisions.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    PrismaModule,
    PairTimesModule,
    LessonSessionsModule,
    AcademicGroupsModule,
    StudentsModule,
    ScheduleModule,
    RoomsModule,
    DevicesModule,
    SubjectsModule,
    TeachersModule,
    SubjectSubdivisionsModule,
    AttendanceModule,
  ],
})
export class AppModule {}
