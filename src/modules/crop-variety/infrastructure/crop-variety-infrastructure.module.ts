import { Module } from '@nestjs/common';

/**
 * CropVarietyInfrastructureModule
 * Infrastructure layer for CropVariety (DDD Clean Architecture)
 */
@Module({
  imports: [
    // Persistence, Messaging, Cache, Monitoring, etc.
  ],
  exports: [
    // Persistence, Messaging, Cache, Monitoring, etc.
  ],
})
export class CropVarietyInfrastructureModule {}
