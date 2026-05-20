import { IsEnum, IsInt, IsOptional } from 'class-validator';

import { LessonType, WeekDay } from '@prisma/client';

export class CreateScheduleTemplateDto {
  @IsEnum(WeekDay)
  weekday!: WeekDay;

  @IsEnum(LessonType)
  lessonType!: LessonType;

  @IsInt()
  subjectId!: number;

  @IsInt()
  teacherId!: number;

  @IsInt()
  roomId!: number;

  @IsInt()
  pairTimeId!: number;

  @IsInt()
  groupId!: number;

  @IsOptional()
  @IsInt()
  subdivisionId?: number;
}
