import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ProfileController } from './profile.controller';
import { RolesGuard } from './roles.guard';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, ProfileController, AdminController],
  providers: [AuthService, PrismaService, JwtStrategy, RolesGuard],
})
export class AuthModule {}
