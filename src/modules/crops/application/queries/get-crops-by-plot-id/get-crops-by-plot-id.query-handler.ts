import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetCropVarietyByIdQuery } from 'src/modules/crops-variety/application/queries/get-crop-variety-by-id/get-crop-variety-by-id.query';
import { CropDetailsResult } from '../../dtos/crop-details.result';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { GetCropsByPlotIdQuery } from './get-crops-by-plot-id.query';

/**
 * Query handler for GetCropsByPlotIdQuery
 */
@QueryHandler(GetCropsByPlotIdQuery)
export class GetCropsByPlotIdQueryHandler
  implements IQueryHandler<GetCropsByPlotIdQuery>
{
  constructor(
    @Inject(CROPS_REPOSITORY_TOKEN)
    private readonly cropsRepository: CropsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the GetCropsByPlotIdQuery
   * @param query - The query to handle
   * @returns Array of CropDetailsResult
   */
  async execute(query: GetCropsByPlotIdQuery): Promise<CropDetailsResult[]> {
    const crops = await this.cropsRepository.findAllByPlotId(query.plotId);

    const result: CropDetailsResult[] = [];

    for (const crop of crops) {
      const cropVariety = await this.queryBus.execute(
        new GetCropVarietyByIdQuery(crop.varietyId),
      );
      result.push(new CropDetailsResult(crop, cropVariety));
    }

    return result;
  }
}
