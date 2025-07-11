import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthApplicationModule } from '../../application/auth-application.module';

/**
 * AuthGraphQLModule
 * Presenters layer module for GraphQL resolvers in Auth (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [CqrsModule, AuthApplicationModule],
  providers: [AuthResolver],
  exports: [AuthResolver],
})
export class AuthGraphQLModule {}
