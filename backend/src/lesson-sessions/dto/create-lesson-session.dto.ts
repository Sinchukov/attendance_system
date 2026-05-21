import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';

import { LessonType } from '@prisma/client';

export class CreateLessonSessionDto {
  @IsDateString()
  lessonDate!: string;

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
