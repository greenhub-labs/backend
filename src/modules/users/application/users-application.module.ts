import { Module } from '@nestjs/common';

/**
 * UsersApplicationModule
 * Application layer for Users (DDD Clean Architecture)
 */
@Module({
  providers: [
    // CommandHandlers, QueryHandlers, EventHandlers, Sagas, Projections, etc.
  ],
  exports: [
    // CommandHandlers, QueryHandlers, EventHandlers, Sagas, Projections, etc.
  ],
})
export class UsersApplicationModule {}
