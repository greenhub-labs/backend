import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthInfrastructureModule } from 'src/modules/auth/infrastructure/auth-infrastructure.module';
import { CropsVarietyApplicationModule } from '../../application/crops-application.module';
import { CropsVarietyInfrastructureModule } from '../../infrastructure/crops-infrastructure.module';
import { CropVarietyResolver } from './resolvers/crop-variety.resolver';

/**
 * CropsVarietyGraphQLModule
 * Presenters layer module for GraphQL resolvers in CropsVariety (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [
    CqrsModule,
    CropsVarietyApplicationModule,
    CropsVarietyInfrastructureModule,
    AuthInfrastructureModule,
  ],
  providers: [CropVarietyResolver],
  exports: [CropVarietyResolver],
})
export class CropsVarietyGraphQLModule {}
