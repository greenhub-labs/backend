import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PlotsApplicationModule } from '../../application/plots-application.module';
import { PlotsInfrastructureModule } from '../../infrastructure/plots-infrastructure.module';
import { AuthInfrastructureModule } from 'src/modules/auth/infrastructure/auth-infrastructure.module';
import { PlotResolver } from './resolvers/plot.resolver';

/**
 * PlotsGraphQLModule
 * Presenters layer module for GraphQL resolvers in Plots (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [
    CqrsModule,
    PlotsApplicationModule,
    PlotsInfrastructureModule,
    AuthInfrastructureModule,
  ],
  providers: [PlotResolver],
  exports: [PlotResolver],
})
export class PlotsGraphQLModule {}
