import { IsNumber, IsString, MinLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsString()
  @MinLength(1)
  studentCardNo!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  groupId!: number;
}
