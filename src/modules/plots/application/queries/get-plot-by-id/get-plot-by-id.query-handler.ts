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
import { GetPlotByIdQuery } from './get-plot-by-id.query';

/**
 * Query handler for GetPlotByIdQuery
 */
@QueryHandler(GetPlotByIdQuery)
export class GetPlotByIdQueryHandler
  implements IQueryHandler<GetPlotByIdQuery>
{
  constructor(
    @Inject(PLOTS_REPOSITORY_TOKEN)
    private readonly plotsRepository: PlotsRepository,
    @Inject(PLOTS_CACHE_REPOSITORY_TOKEN)
    private readonly plotsCacheRepository: PlotsCacheRepository,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the GetPlotByIdQuery
   * @param query - The query to handle
   * @returns The PlotEntity if found
   * @throws PlotNotFoundException if not found
   */
  async execute(query: GetPlotByIdQuery): Promise<PlotDetailsResult> {
    let plot = await this.plotsCacheRepository.get(query.plotId);
    if (!plot) {
      // If not in cache, fetch from repository
      plot = await this.plotsRepository.findById(query.plotId);
      await this.plotsCacheRepository.set(query.plotId, plot);
    }
    if (!plot) {
      throw new PlotNotFoundException(query.plotId);
    }

    const crops = await this.queryBus.execute(
      new GetCropsByPlotIdQuery(plot.id.value),
    );
    return new PlotDetailsResult(plot, crops);
  }
}
