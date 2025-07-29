import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CropVarietyNotFoundException } from 'src/modules/crops-variety/domain/exceptions/crop-variety-not-found/crop-variety-not-found.exception';
import { CropVarietyEntity } from '../../../domain/entities/crop-variety.entity';
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
      throw new CropVarietyNotFoundException(query.cropVarietyId);
    }
    return cropVariety;
  }
}
