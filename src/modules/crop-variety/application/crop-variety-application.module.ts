import { Module } from '@nestjs/common';

/**
 * CropVarietyApplicationModule
 * Application layer for CropVariety (DDD Clean Architecture)
 */
@Module({
  providers: [
    // CommandHandlers, QueryHandlers, EventHandlers, Sagas, Projections, etc.
  ],
  exports: [
    // CommandHandlers, QueryHandlers, EventHandlers, Sagas, Projections, etc.
  ],
})
export class CropVarietyApplicationModule {}
