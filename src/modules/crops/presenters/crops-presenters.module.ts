import { Module } from '@nestjs/common';
import { CropsGraphQLModule } from './graphql/crops-graphql.module';

/**
 * PlotsPresentersModule
 * Presenters layer module for Plots (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [CropsGraphQLModule],
  exports: [CropsGraphQLModule],
})
export class CropsPresentersModule {}
