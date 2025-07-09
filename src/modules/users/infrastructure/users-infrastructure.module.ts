import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../shared/infrastructure/prisma/prisma.module';
import { UserPrismaRepository } from './persistance/prisma/repositories/user-prisma.repository';
import { USER_REPOSITORY_TOKEN } from '../application/ports/user.repository';

/**
 * UsersInfrastructureModule
 * Infrastructure layer for Users (DDD Clean Architecture)
 */
@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UsersInfrastructureModule {}
