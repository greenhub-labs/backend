import { Module } from '@nestjs/common';
import { CropsVarietyGraphQLModule } from './graphql/crops-graphql.module';

/**
 * PlotsPresentersModule
 * Presenters layer module for Plots (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [CropsVarietyGraphQLModule],
  exports: [CropsVarietyGraphQLModule],
})
export class CropsVarietyPresentersModule {}
