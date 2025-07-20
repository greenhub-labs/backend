import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { PlotDetailsResult } from 'src/modules/plots/application/dtos/plot-details.result';
import { GetPlotsByFarmIdQuery } from 'src/modules/plots/application/queries/get-plots-by-farm-id/get-plots-by-farm-id.query';
import { FarmDetailsResult } from '../../dtos/farm-details.result';
import { FarmMembershipsRepository } from '../../ports/farm-memberships.repository';
import {
  FARMS_CACHE_REPOSITORY_TOKEN,
  FarmsCacheRepository,
} from '../../ports/farms-cache.repository';
import {
  FARMS_REPOSITORY_TOKEN,
  FarmsRepository,
} from '../../ports/farms.repository';
import { GetAllFarmsQuery } from './get-all-farms.query';

/**
 * Query handler for GetAllFarmsQuery
 */
@QueryHandler(GetAllFarmsQuery)
export class GetAllFarmsQueryHandler
  implements IQueryHandler<GetAllFarmsQuery>
{
  private readonly logger = new Logger(GetAllFarmsQueryHandler.name);
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepository,
    @Inject(FARMS_CACHE_REPOSITORY_TOKEN)
    private readonly farmsCacheRepository: FarmsCacheRepository,
    @Inject('FARM_MEMBERSHIPS_REPOSITORY_TOKEN')
    private readonly farmMembershipsRepository: FarmMembershipsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the GetAllFarmsQuery
   * @param query - The query to handle
   * @returns Array of FarmEntity
   */
  async execute(query: GetAllFarmsQuery): Promise<FarmDetailsResult[]> {
    this.logger.debug('Executing GetAllFarmsQuery');
    const farms = await this.farmsRepository.findAll();
    const results = await Promise.all(
      farms.map(async (farm) => {
        const members = await this.farmMembershipsRepository.getUsersByFarmId(
          farm.id.value,
        );
        const plotsDetailsResults: PlotDetailsResult[] =
          await this.queryBus.execute(new GetPlotsByFarmIdQuery(farm.id.value));

        this.logger.debug(
          `Found ${plotsDetailsResults.map((plot) => plot.plot.id.value).join(', ')} plots for farm ${farm.id.value}`,
        );

        return new FarmDetailsResult(
          farm,
          members,
          plotsDetailsResults.map((plot) => plot.plot),
        );
      }),
    );
    return results;
  }
}
