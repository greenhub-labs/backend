import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CropVarietyEntity } from 'src/modules/crops/domain/entities/crop-variety.entity';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import {
  CROP_VARIETY_CACHE_REPOSITORY_TOKEN,
  CropVarietyCacheRepository,
} from '../../ports/crop-variety-cache.repository';
import {
  CROP_VARIETY_REPOSITORY_TOKEN,
  CropVarietyRepository,
} from '../../ports/crop-variety.repository';
import { GetCropVarietyByIdQuery } from './get-crop-variety-by-id.query';

/**
 * Query handler for GetCropByIdQuery
 */
@QueryHandler(GetCropVarietyByIdQuery)
export class GetCropVarietyByIdQueryHandler
  implements IQueryHandler<GetCropVarietyByIdQuery>
{
  constructor(
    @Inject(CROP_VARIETY_REPOSITORY_TOKEN)
    private readonly cropVarietyRepository: CropVarietyRepository,
    @Inject(CROP_VARIETY_CACHE_REPOSITORY_TOKEN)
    private readonly cropVarietyCacheRepository: CropVarietyCacheRepository,
  ) {}

  /**
   * Handles the GetCropVarietyByIdQuery
   * @param query - The query to handle
   * @returns The CropDetailsResult if found
   * @throws CropNotFoundException if not found
   */
  async execute(query: GetCropVarietyByIdQuery): Promise<CropVarietyEntity> {
    let cropVariety = await this.cropVarietyCacheRepository.get(
      query.cropVarietyId,
    );
    if (!cropVariety) {
      // If not in cache, fetch from repository
      cropVariety = await this.cropVarietyRepository.findById(
        query.cropVarietyId,
      );
      if (cropVariety) {
        await this.cropVarietyCacheRepository.set(
          query.cropVarietyId,
          cropVariety,
        );
      }
    }
    if (!cropVariety) {
      throw new CropNotFoundException(query.cropVarietyId);
    }
    return cropVariety;
  }
}
