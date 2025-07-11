import { Module } from '@nestjs/common';
import { AuthGraphQLModule } from './graphql/auth-graphql.module';

/**
 * AuthPresentersModule
 * Presenters layer for Auth (HTTP, GraphQL, Events, etc.)
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [AuthGraphQLModule],
  exports: [AuthGraphQLModule],
})
export class AuthPresentersModule {}
