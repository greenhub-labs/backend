import { Module } from '@nestjs/common';

/**
 * UsersInfrastructureModule
 * Infrastructure layer for Users (DDD Clean Architecture)
 */
@Module({
  imports: [
    // Persistence, Messaging, Cache, Monitoring, etc.
  ],
  exports: [
    // Persistence, Messaging, Cache, Monitoring, etc.
  ],
})
export class UsersInfrastructureModule {}
