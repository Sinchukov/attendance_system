import { Module } from '@nestjs/common';
import { AcademicGroupsController } from './academic-groups.controller';
import { AcademicGroupsService } from './academic-groups.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AcademicGroupsController],
  providers: [AcademicGroupsService],
})
export class AcademicGroupsModule {}
