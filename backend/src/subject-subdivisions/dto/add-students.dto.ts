import { IsArray, IsInt, ArrayNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddStudentsDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  studentIds!: number[];
}
