import { Module } from '@nestjs/common';
import { UserResolver } from './resolvers/user.resolver';
import { UsersApplicationModule } from '../../application/users-application.module';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthInfrastructureModule } from '../../../auth/infrastructure/auth-infrastructure.module';

/**
 * UsersGraphQLModule
 * Presenters layer module for GraphQL resolvers in Users (DDD Clean Architecture)
 * Now includes Auth infrastructure for JWT guard protection
 */
@Module({
  imports: [
    UsersApplicationModule,
    CqrsModule,
    AuthInfrastructureModule, // For JWT guard access
  ],
  providers: [UserResolver],
  exports: [UserResolver],
})
export class UsersGraphQLModule {}
