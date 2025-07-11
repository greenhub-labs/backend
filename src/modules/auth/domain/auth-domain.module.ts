import { Module } from '@nestjs/common';
import { AuthFactory } from './factories/auth/auth.factory';

/**
 * AuthDomainModule
 * Domain layer for Auth (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
@Module({
  providers: [AuthFactory],
  exports: [AuthFactory],
})
export class AuthDomainModule {}
