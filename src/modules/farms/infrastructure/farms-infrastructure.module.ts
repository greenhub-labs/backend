import { Module } from '@nestjs/common';
import { FarmPrismaRepository } from './persistance/prisma/repositories/farm-prisma.repository';
import { FarmsRedisCacheRepository } from './cache/redis/repositories/farm-redis-cache.repository';
import { FARMS_REPOSITORY_TOKEN } from '../application/ports/farms.repository';
import { FARMS_CACHE_REPOSITORY_TOKEN } from '../application/ports/farms-cache.repository';
import {
  FarmMembershipsPrismaRepository,
  FARM_MEMBERSHIPS_REPOSITORY_TOKEN,
} from './persistance/prisma/repositories/farm-memberships-prisma.repository';

/**
 * FarmsInfrastructureModule
 * Infrastructure layer for Farms (DDD Clean Architecture)
 */
@Module({
  imports: [],
  providers: [
    {
      provide: FARMS_REPOSITORY_TOKEN,
      useClass: FarmPrismaRepository,
    },
    {
      provide: FARMS_CACHE_REPOSITORY_TOKEN,
      useClass: FarmsRedisCacheRepository,
    },
    {
      provide: FARM_MEMBERSHIPS_REPOSITORY_TOKEN,
      useClass: FarmMembershipsPrismaRepository,
    },
    // Add more providers as needed
  ],
  exports: [
    FARMS_REPOSITORY_TOKEN,
    FARMS_CACHE_REPOSITORY_TOKEN,
    FARM_MEMBERSHIPS_REPOSITORY_TOKEN,
  ],
})
export class FarmsInfrastructureModule {}
