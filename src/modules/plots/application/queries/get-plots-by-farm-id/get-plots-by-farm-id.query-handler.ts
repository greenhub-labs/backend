import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetCropsByPlotIdQuery } from 'src/modules/crops/application/queries/get-crops-by-plot-id/get-crops-by-plot-id.query';
import { PlotNotFoundException } from '../../../domain/exceptions/plot-not-found/plot-not-found.exception';
import { PlotDetailsResult } from '../../dtos/plot-details.result';
import {
  PLOTS_CACHE_REPOSITORY_TOKEN,
  PlotsCacheRepository,
} from '../../ports/plots-cache.repository';
import {
  PLOTS_REPOSITORY_TOKEN,
  PlotsRepository,
} from '../../ports/plots.repository';
import { GetPlotsByFarmIdQuery } from './get-plots-by-farm-id.query';

/**
 * Query handler for GetPlotsByFarmIdQuery
 */
@QueryHandler(GetPlotsByFarmIdQuery)
export class GetPlotsByFarmIdQueryHandler
  implements IQueryHandler<GetPlotsByFarmIdQuery>
{
  constructor(
    @Inject(PLOTS_REPOSITORY_TOKEN)
    private readonly plotsRepository: PlotsRepository,
    @Inject(PLOTS_CACHE_REPOSITORY_TOKEN)
    private readonly plotsCacheRepository: PlotsCacheRepository,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the GetPlotsByFarmIdQuery
   * @param query - The query to handle
   * @returns The PlotEntity if found
   * @throws PlotNotFoundException if not found
   */
  async execute(query: GetPlotsByFarmIdQuery): Promise<PlotDetailsResult[]> {
    let plots = await this.plotsCacheRepository.getMany([query.farmId]);
    if (!plots || plots.length === 0) {
      // If not in cache, fetch from repository
      plots = await this.plotsRepository.findAllByFarmId(query.farmId);
      await this.plotsCacheRepository.setMany(
        plots.map((plot) => ({
          key: plot.id.value,
          entity: plot,
        })),
      );
    }
    if (!plots) {
      throw new PlotNotFoundException(query.farmId);
    }

    const plotDetailsPromises = plots.map(async (plot) => {
      const crops = await this.queryBus.execute(
        new GetCropsByPlotIdQuery(plot.id.value),
      );
      return new PlotDetailsResult(plot, crops);
    });

    return Promise.all(plotDetailsPromises);
  }
}
