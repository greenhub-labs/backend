import { Module } from '@nestjs/common';

/**
 * UsersModule
 * Main orchestrator for the Users bounded context (DDD Clean Architecture)
 */
@Module({
  imports: [
    // UsersDomainModule,
    // UsersApplicationModule,
    // UsersInfrastructureModule,
  ],
  exports: [],
})
export class UsersModule {}
