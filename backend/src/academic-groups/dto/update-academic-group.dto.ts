import { PartialType } from '@nestjs/mapped-types';
import { CreateAcademicGroupDto } from './create-academic-group.dto';

export class UpdateAcademicGroupDto extends PartialType(
  CreateAcademicGroupDto,
) {}
