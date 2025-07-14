import { Module } from '@nestjs/common';
import { FarmsPrismaRepository } from './persistance/prisma/repositories/farms-prisma.repository';
import { FarmsRedisCacheRepository } from './cache/redis/repositories/farms-redis-cache.repository';
import { FARMS_REPOSITORY_TOKEN } from '../application/ports/farms.repository';
import { FARMS_CACHE_REPOSITORY_TOKEN } from '../application/ports/farms-cache.repository';

/**
 * FarmsInfrastructureModule
 * Infrastructure layer for Farms (DDD Clean Architecture)
 */
@Module({
  imports: [],
  providers: [
    {
      provide: FARMS_REPOSITORY_TOKEN,
      useClass: FarmsPrismaRepository,
    },
    {
      provide: FARMS_CACHE_REPOSITORY_TOKEN,
      useClass: FarmsRedisCacheRepository,
    },
    // Add more providers as needed
  ],
  exports: [FARMS_REPOSITORY_TOKEN, FARMS_CACHE_REPOSITORY_TOKEN],
})
export class FarmsInfrastructureModule {} 