import { Module } from '@nestjs/common';

/**
 * CropVarietyModule
 * Main orchestrator for the CropVariety bounded context (DDD Clean Architecture)
 */
@Module({
  imports: [
    // CropVarietyDomainModule,
    // CropVarietyApplicationModule,
    // CropVarietyInfrastructureModule,
  ],
  exports: [],
})
export class CropVarietyModule {}
