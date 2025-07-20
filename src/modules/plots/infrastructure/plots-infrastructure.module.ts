import { Module } from '@nestjs/common';
import { PlotPrismaRepository } from './persistance/prisma/repositories/plot-prisma.repository';
import { PlotsRedisCacheRepository } from './cache/redis/repositories/plot-redis-cache.repository';
import { PLOTS_REPOSITORY_TOKEN } from '../application/ports/plots.repository';
import { PLOTS_CACHE_REPOSITORY_TOKEN } from '../application/ports/plots-cache.repository';

/**
 * PlotsInfrastructureModule
 * Infrastructure layer for Plots (DDD Clean Architecture)
 */
@Module({
  imports: [],
  providers: [
    {
      provide: PLOTS_REPOSITORY_TOKEN,
      useClass: PlotPrismaRepository,
    },
    {
      provide: PLOTS_CACHE_REPOSITORY_TOKEN,
      useClass: PlotsRedisCacheRepository,
    },
    // Add more providers as needed
  ],
  exports: [PLOTS_REPOSITORY_TOKEN, PLOTS_CACHE_REPOSITORY_TOKEN],
})
export class PlotsInfrastructureModule {}
