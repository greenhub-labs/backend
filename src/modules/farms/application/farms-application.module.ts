import { Module } from '@nestjs/common';

/**
 * FarmsApplicationModule
 * Application layer for Farms (DDD Clean Architecture)
 */
@Module({
  providers: [
    // CommandHandlers, QueryHandlers, EventHandlers, Sagas, Projections, etc.
  ],
  exports: [
    // CommandHandlers, QueryHandlers, EventHandlers, Sagas, Projections, etc.
  ],
})
export class FarmsApplicationModule {}
