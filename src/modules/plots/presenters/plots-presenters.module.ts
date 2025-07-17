import { Module } from '@nestjs/common';
import { PlotsGraphQLModule } from './graphql/plots-graphql.module';

/**
 * PlotsPresentersModule
 * Presenters layer module for Plots (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [PlotsGraphQLModule],
  exports: [PlotsGraphQLModule],
})
export class PlotsPresentersModule {}
