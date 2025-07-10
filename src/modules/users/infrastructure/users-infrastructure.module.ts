import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../shared/infrastructure/prisma/prisma.module';
import { RedisModule } from '../../../shared/infrastructure/redis/redis.module';
import { UserPrismaRepository } from './persistance/prisma/repositories/user-prisma.repository';
import { UserRedisCacheRepository } from './cache/redis/repositories/user-redis-cache.repository';
import { USER_REPOSITORY_TOKEN } from '../application/ports/user.repository';
import { USER_CACHE_REPOSITORY_TOKEN } from '../application/ports/user-cache.repository';

/**
 * UsersInfrastructureModule
 * Infrastructure layer for Users (DDD Clean Architecture)
 */
@Module({
  imports: [PrismaModule, RedisModule],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserPrismaRepository,
    },
    {
      provide: USER_CACHE_REPOSITORY_TOKEN,
      useClass: UserRedisCacheRepository,
    },
  ],
  exports: [USER_REPOSITORY_TOKEN, USER_CACHE_REPOSITORY_TOKEN],
})
export class UsersInfrastructureModule {}
