import { Module } from '@nestjs/common';
import { FarmsGraphQLModule } from './graphql/farms-graphql.module';

@Module({
  imports: [FarmsGraphQLModule],
  exports: [FarmsGraphQLModule],
})
export class FarmsPresentersModule {}
