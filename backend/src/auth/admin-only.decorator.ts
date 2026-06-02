import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';

import { RolesGuard } from './roles.guard';

import { Roles } from './roles.decorator';

export function AdminOnly() {
  return UseGuards(JwtAuthGuard, RolesGuard);
}

export const AdminRole = () => Roles('ADMIN');
