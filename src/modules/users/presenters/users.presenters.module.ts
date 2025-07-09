import { Module } from '@nestjs/common';
import { UsersGraphQLModule } from './graphql/graphql.module';

/**
 * UsersPresentersModule
 * Presenters layer for Users (HTTP, GraphQL, Events, etc.)
 */
@Module({
  imports: [UsersGraphQLModule],
  exports: [UsersGraphQLModule],
})
export class UsersPresentersModule {}
