import { IsInt } from 'class-validator';

export class CreateSubdivisionStudentDto {
  @IsInt()
  subdivisionId: number;

  @IsInt()
  studentId: number;
}
