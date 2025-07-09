import { Module } from '@nestjs/common';

/**
 * UsersDomainModule
 * Domain layer for Users (DDD Clean Architecture)
 */
@Module({
  providers: [
    // Entities, ValueObjects, DomainServices, Factories, etc.
  ],
  exports: [
    // Entities, ValueObjects, DomainServices, Factories, etc.
  ],
})
export class UsersDomainModule {}
