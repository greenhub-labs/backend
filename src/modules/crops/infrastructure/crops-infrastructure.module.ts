import { Module } from '@nestjs/common';
import { CROP_VARIETY_CACHE_REPOSITORY_TOKEN } from '../application/ports/crop-variety-cache.repository';
import { CROP_VARIETY_REPOSITORY_TOKEN } from '../application/ports/crop-variety.repository';
import { CROPS_CACHE_REPOSITORY_TOKEN } from '../application/ports/crops-cache.repository';
import { CROPS_REPOSITORY_TOKEN } from '../application/ports/crops.repository';
import { CropsRedisCacheRepository } from './cache/redis/repositories/crop-redis-cache.repository';
import { CropsVarietyRedisCacheRepository } from './cache/redis/repositories/crop-variety-redis-cache.repository';
import { CropPrismaRepository } from './persistance/prisma/repositories/crop-prisma.repository';
import { CropVarietyPrismaRepository } from './persistance/prisma/repositories/crop-variety-prisma.repository';

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
    {
      provide: CROP_VARIETY_REPOSITORY_TOKEN,
      useClass: CropVarietyPrismaRepository,
    },
    {
      provide: CROP_VARIETY_CACHE_REPOSITORY_TOKEN,
      useClass: CropsVarietyRedisCacheRepository,
    },
    // Add more providers as needed
  ],
  exports: [
    CROPS_REPOSITORY_TOKEN,
    CROPS_CACHE_REPOSITORY_TOKEN,
    CROP_VARIETY_REPOSITORY_TOKEN,
    CROP_VARIETY_CACHE_REPOSITORY_TOKEN,
  ],
})
export class CropsInfrastructureModule {}
