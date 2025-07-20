import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PlotDetailsResult } from '../../dtos/plot-details.result';
import {
  PLOTS_CACHE_REPOSITORY_TOKEN,
  PlotsCacheRepository,
} from '../../ports/plots-cache.repository';
import {
  PLOTS_REPOSITORY_TOKEN,
  PlotsRepository,
} from '../../ports/plots.repository';
import { GetAllPlotsQuery } from './get-all-plots.query';

/**
 * Query handler for GetAllPlotsQuery
 */
@QueryHandler(GetAllPlotsQuery)
export class GetAllPlotsQueryHandler
  implements IQueryHandler<GetAllPlotsQuery>
{
  constructor(
    @Inject(PLOTS_REPOSITORY_TOKEN)
    private readonly plotsRepository: PlotsRepository,
    @Inject(PLOTS_CACHE_REPOSITORY_TOKEN)
    private readonly plotsCacheRepository: PlotsCacheRepository,
  ) {}

  /**
   * Handles the GetAllFarmsQuery
   * @param query - The query to handle
   * @returns Array of FarmEntity
   */
  async execute(query: GetAllPlotsQuery): Promise<PlotDetailsResult[]> {
    const plots = await this.plotsRepository.findAll();
    const results = await Promise.all(
      plots.map(async (plot) => {
        return new PlotDetailsResult(plot);
      }),
    );
    return results;
  }
}
