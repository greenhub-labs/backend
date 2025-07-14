import { Module } from '@nestjs/common';
import { FarmsGraphqlModule } from './graphql/farms-graphql.module';

@Module({
  imports: [
    FarmsGraphqlModule, 
  ],
  exports: [
    FarmsGraphqlModule, 
  ],  
})
export class FarmsPresentersModule {} 