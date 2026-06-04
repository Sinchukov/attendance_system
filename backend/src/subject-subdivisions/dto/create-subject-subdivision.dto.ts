import { IsInt, IsString, MinLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubjectSubdivisionDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  subjectId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  groupId!: number;
}
