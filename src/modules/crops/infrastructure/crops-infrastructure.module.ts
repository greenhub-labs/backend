import { Module } from '@nestjs/common';
import { CROPS_CACHE_REPOSITORY_TOKEN } from '../application/ports/crops-cache.repository';
import { CROPS_REPOSITORY_TOKEN } from '../application/ports/crops.repository';
import { CropsRedisCacheRepository } from './cache/redis/repositories/crop-redis-cache.repository';
import { CropPrismaRepository } from './persistance/prisma/repositories/crop-prisma.repository';

/**
 * PlotsInfrastructureModule
 * Infrastructure layer for Plots (DDD Clean Architecture)
 */
@Module({
  imports: [],
  providers: [
    {
      provide: CROPS_REPOSITORY_TOKEN,
      useClass: CropPrismaRepository,
    },
    {
      provide: CROPS_CACHE_REPOSITORY_TOKEN,
      useClass: CropsRedisCacheRepository,
    },
    // Add more providers as needed
  ],
  exports: [CROPS_REPOSITORY_TOKEN, CROPS_CACHE_REPOSITORY_TOKEN],
})
export class CropsInfrastructureModule {}
