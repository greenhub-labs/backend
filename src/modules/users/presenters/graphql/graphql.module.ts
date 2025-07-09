import { Module } from '@nestjs/common';
import { UserResolver } from './resolvers/user.resolver';
import { UsersApplicationModule } from '../../application/users-application.module';
import { CqrsModule } from '@nestjs/cqrs';

/**
 * UsersGraphQLModule
 * Presenters layer module for GraphQL resolvers in Users (DDD Clean Architecture)
 */
@Module({
  imports: [UsersApplicationModule, CqrsModule],
  providers: [UserResolver],
  exports: [UserResolver],
})
export class UsersGraphQLModule {}
