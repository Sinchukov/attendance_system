import { IsString } from 'class-validator';

export class CancelLessonDto {
  @IsString()
  reason!: string;
}
