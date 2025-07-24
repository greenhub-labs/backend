import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import {
  CROP_VARIETY_REPOSITORY_TOKEN,
  CropVarietyRepository,
} from '../../ports/crop-variety.repository';
import { GetAllCropsVarietiesQuery } from './get-all-crops-varieties.query';

/**
 * Query handler for GetAllCropsQuery
 */
@QueryHandler(GetAllCropsVarietiesQuery)
export class GetAllCropsVarietiesQueryHandler
  implements IQueryHandler<GetAllCropsVarietiesQuery>
{
  constructor(
    @Inject(CROP_VARIETY_REPOSITORY_TOKEN)
    private readonly cropVarietyRepository: CropVarietyRepository,
  ) {}

  /**
   * Handles the GetAllCropsQuery
   * @param query - The query to handle
   * @returns Array of CropDetailsResult
   */
  async execute(
    query: GetAllCropsVarietiesQuery,
  ): Promise<CropVarietyEntity[]> {
    return this.cropVarietyRepository.findAll();
  }
}
