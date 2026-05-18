import { LessonType, WeekDay } from '@prisma/client';

export class CreateScheduleDto {
  weekday!: WeekDay;

  lessonType!: LessonType;

  subjectId!: number;

  teacherId!: number;

  roomId!: number;

  pairTimeId!: number;

  groupId!: number;

  subdivisionId?: number;
}
