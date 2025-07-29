import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetPlotsByFarmIdQuery } from 'src/modules/plots/application/queries/get-plots-by-farm-id/get-plots-by-farm-id.query';
import { CropDetailsResult } from '../../dtos/crop-details.result';
import { GetCropsByFarmIdQuery } from './get-crops-by-farm-id.query';

@QueryHandler(GetCropsByFarmIdQuery)
export class GetCropsByFarmIdQueryHandler
  implements IQueryHandler<GetCropsByFarmIdQuery>
{
  private readonly logger = new Logger(GetCropsByFarmIdQueryHandler.name);

  constructor(private readonly queryBus: QueryBus) {}

  /**
   * Handles the GetCropsByFarmIdQuery
   *
   * DDD Approach:
   * 1. Get all plots for the farm using QueryBus
   * 2. Extract crops from PlotDetailsResult (which already includes crops)
   * 3. Flatten all crops from all plots using functional approach
   *
   * @param query - The query to handle
   * @returns Array of CropDetailsResult for all crops in the farm
   */
  async execute(query: GetCropsByFarmIdQuery): Promise<CropDetailsResult[]> {
    this.logger.log(`Executing query for farm ID: ${query.farmId}`);

    // 1. Get all plots for the farm using QueryBus (PlotDetailsResult includes crops)
    const plotDetails = await this.queryBus.execute(
      new GetPlotsByFarmIdQuery(query.farmId),
    );

    this.logger.debug(`Found ${plotDetails.length} plots`);

    // Early return for empty results
    if (!plotDetails?.length) {
      return [];
    }

    // 2. Extract and flatten all crops from all plots using functional approach
    return plotDetails.map(({ crops }) => crops).flat();
  }
}
