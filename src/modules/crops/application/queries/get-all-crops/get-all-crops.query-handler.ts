import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { CropDetailsResult } from '../../dtos/crop-details.result';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { GetCropVarietyByIdQuery } from '../get-crop-variety-by-id/get-crop-variety-by-id.query';
import { GetAllCropsQuery } from './get-all-crops.query';

/**
 * Query handler for GetAllCropsQuery
 */
@QueryHandler(GetAllCropsQuery)
export class GetAllCropsQueryHandler
  implements IQueryHandler<GetAllCropsQuery>
{
  constructor(
    @Inject(CROPS_REPOSITORY_TOKEN)
    private readonly cropsRepository: CropsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the GetAllCropsQuery
   * @param query - The query to handle
   * @returns Array of CropDetailsResult
   */
  async execute(query: GetAllCropsQuery): Promise<CropDetailsResult[]> {
    const crops = await this.cropsRepository.findAll();

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
