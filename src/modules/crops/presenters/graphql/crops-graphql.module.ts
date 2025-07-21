import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthInfrastructureModule } from 'src/modules/auth/infrastructure/auth-infrastructure.module';
import { CropsApplicationModule } from '../../application/crops-application.module';
import { CropsInfrastructureModule } from '../../infrastructure/crops-infrastructure.module';
import { CropVarietyResolver } from './resolvers/crop-variety.resolver';
import { CropResolver } from './resolvers/crop.resolver';

/**
 * CropsGraphQLModule
 * Presenters layer module for GraphQL resolvers in Crops (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [
    CqrsModule,
    CropsApplicationModule,
    CropsInfrastructureModule,
    AuthInfrastructureModule,
  ],
  providers: [CropResolver, CropVarietyResolver],
  exports: [CropResolver, CropVarietyResolver],
})
export class CropsGraphQLModule {}
