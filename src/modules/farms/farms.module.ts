import { Module } from '@nestjs/common';

/**
 * FarmsModule
 * Main orchestrator for the Farms bounded context (DDD Clean Architecture)
 */
@Module({
  imports: [
    // FarmsDomainModule,
    // FarmsApplicationModule,
    // FarmsInfrastructureModule,
  ],
  exports: [],
})
export class FarmsModule {}
