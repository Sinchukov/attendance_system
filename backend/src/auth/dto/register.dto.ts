import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;
}
