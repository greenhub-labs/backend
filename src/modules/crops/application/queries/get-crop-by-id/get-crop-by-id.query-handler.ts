import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetCropVarietyByIdQuery } from 'src/modules/crops-variety/application/queries/get-crop-variety-by-id/get-crop-variety-by-id.query';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import { CropDetailsResult } from '../../dtos/crop-details.result';
import {
  CROPS_CACHE_REPOSITORY_TOKEN,
  CropsCacheRepository,
} from '../../ports/crops-cache.repository';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { GetCropByIdQuery } from './get-crop-by-id.query';

/**
 * Query handler for GetCropByIdQuery
 */
@QueryHandler(GetCropByIdQuery)
export class GetCropByIdQueryHandler
  implements IQueryHandler<GetCropByIdQuery>
{
  constructor(
    @Inject(CROPS_REPOSITORY_TOKEN)
    private readonly cropsRepository: CropsRepository,
    @Inject(CROPS_CACHE_REPOSITORY_TOKEN)
    private readonly cropsCacheRepository: CropsCacheRepository,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the GetCropByIdQuery
   * @param query - The query to handle
   * @returns The CropDetailsResult if found
   * @throws CropNotFoundException if not found
   */
  async execute(query: GetCropByIdQuery): Promise<CropDetailsResult> {
    let crop = await this.cropsCacheRepository.get(query.cropId);
    if (!crop) {
      // If not in cache, fetch from repository
      crop = await this.cropsRepository.findById(query.cropId);
      if (crop) {
        await this.cropsCacheRepository.set(query.cropId, crop);
      }
    }
    if (!crop) {
      throw new CropNotFoundException(query.cropId);
    }

    // 2. Get the crop variety
    const cropVariety = await this.queryBus.execute(
      new GetCropVarietyByIdQuery(crop.varietyId),
    );

    return new CropDetailsResult(crop, cropVariety);
  }
}
