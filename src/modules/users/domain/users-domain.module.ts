import { Module } from '@nestjs/common';
import { UserFactory } from './factories/user/user.factory';

/**
 * UsersDomainModule
 * Domain layer for Users (DDD Clean Architecture)
 */
@Module({
  providers: [UserFactory],
  exports: [UserFactory],
})
export class UsersDomainModule {}
