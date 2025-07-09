import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../shared/infrastructure/prisma/prisma.module';
import { UserPrismaRepository } from './persistance/prisma/repositories/user-prisma.repository';

/**
 * UsersInfrastructureModule
 * Infrastructure layer for Users (DDD Clean Architecture)
 */
@Module({
  imports: [PrismaModule],
  providers: [UserPrismaRepository],
  exports: [UserPrismaRepository],
})
export class UsersInfrastructureModule {}
