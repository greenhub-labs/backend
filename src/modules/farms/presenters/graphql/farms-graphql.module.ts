import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FarmResolver } from './resolvers/farm.resolver';
import { FarmsApplicationModule } from '../../application/farms-application.module';
import { FarmsInfrastructureModule } from '../../infrastructure/farms-infrastructure.module';
import { AuthInfrastructureModule } from 'src/modules/auth/infrastructure/auth-infrastructure.module';

/**
 * FarmsGraphQLModule
 * Presenters layer module for GraphQL resolvers in Farms (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [
    CqrsModule,
    FarmsApplicationModule,
    FarmsInfrastructureModule,
    AuthInfrastructureModule,
  ],
  providers: [FarmResolver],
  exports: [FarmResolver],
})
export class FarmsGraphQLModule {}
