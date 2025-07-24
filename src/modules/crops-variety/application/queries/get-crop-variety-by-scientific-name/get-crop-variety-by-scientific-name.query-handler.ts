import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import {
  CROP_VARIETY_CACHE_REPOSITORY_TOKEN,
  CropVarietyCacheRepository,
} from '../../ports/crop-variety-cache.repository';
import {
  CROP_VARIETY_REPOSITORY_TOKEN,
  CropVarietyRepository,
} from '../../ports/crop-variety.repository';
import { GetCropVarietyByScientificNameQuery } from './get-crop-variety-by-scientific-name.query';

/**
 * Query handler for GetCropVarietyByScientificNameQuery
 */
@QueryHandler(GetCropVarietyByScientificNameQuery)
export class GetCropVarietyByScientificNameQueryHandler
  implements IQueryHandler<GetCropVarietyByScientificNameQuery>
{
  constructor(
    @Inject(CROP_VARIETY_REPOSITORY_TOKEN)
    private readonly cropVarietyRepository: CropVarietyRepository,
    @Inject(CROP_VARIETY_CACHE_REPOSITORY_TOKEN)
    private readonly cropVarietyCacheRepository: CropVarietyCacheRepository,
  ) {}

  /**
   * Handles the GetCropVarietyByScientificNameQuery
   * @param query - The query to handle
   * @returns The CropVarietyEntity or null if not found
   */
  async execute(
    query: GetCropVarietyByScientificNameQuery,
  ): Promise<CropVarietyEntity> {
    let cropVariety = await this.cropVarietyCacheRepository.get(
      query.scientificName,
    );

    if (!cropVariety) {
      cropVariety = await this.cropVarietyRepository.findByScientificName(
        query.scientificName,
      );
      await this.cropVarietyCacheRepository.set(
        query.scientificName,
        cropVariety,
      );
    }

    if (!cropVariety) {
      throw new NotFoundException('Crop variety not found');
    }

    return cropVariety;
  }
}
