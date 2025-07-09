import { Module } from '@nestjs/common';

/**
 * FarmsInfrastructureModule
 * Infrastructure layer for Farms (DDD Clean Architecture)
 */
@Module({
  imports: [
    // Persistence, Messaging, Cache, Monitoring, etc.
  ],
  exports: [
    // Persistence, Messaging, Cache, Monitoring, etc.
  ],
})
export class FarmsInfrastructureModule {}
