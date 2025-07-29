import { Module } from '@nestjs/common';
import { CROP_VARIETY_CACHE_REPOSITORY_TOKEN } from '../application/ports/crop-variety-cache.repository';
import { CROP_VARIETY_REPOSITORY_TOKEN } from '../application/ports/crop-variety.repository';
import { CropsVarietyRedisCacheRepository } from './cache/redis/repositories/crop-variety-redis-cache.repository';
import { CropVarietyPrismaRepository } from './persistance/prisma/repositories/crop-variety-prisma.repository';

/**
 * PlotsInfrastructureModule
 * Infrastructure layer for Plots (DDD Clean Architecture)
 */
@Module({
  imports: [],
  providers: [
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
  exports: [CROP_VARIETY_REPOSITORY_TOKEN, CROP_VARIETY_CACHE_REPOSITORY_TOKEN],
})
export class CropsVarietyInfrastructureModule {}
