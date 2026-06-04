import { IsString, MinLength } from 'class-validator';

export class CreateAcademicGroupDto {
  @IsString()
  @MinLength(1)
  name!: string;
}
