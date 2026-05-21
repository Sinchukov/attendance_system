import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import type { StringValue } from 'ms';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,

    PassportModule,

    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,

        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES') as StringValue,
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy],

  exports: [AuthService],
})
export class AuthModule {}
