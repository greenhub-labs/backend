import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetPlotByIdQuery } from './get-plot-by-id.query';
import {
  PLOTS_REPOSITORY_TOKEN,
  PlotsRepository,
} from '../../ports/plots.repository';
import { PlotNotFoundException } from '../../../domain/exceptions/plot-not-found/plot-not-found.exception';
import {
  PLOTS_CACHE_REPOSITORY_TOKEN,
  PlotsCacheRepository,
} from '../../ports/plots-cache.repository';
import { PlotDetailsResult } from '../../dtos/plot-details.result';

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
    return new PlotDetailsResult(plot);
  }
}
