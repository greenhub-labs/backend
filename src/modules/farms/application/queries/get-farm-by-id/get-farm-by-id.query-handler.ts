import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetFarmByIdQuery } from './get-farm-by-id.query';
import {
  FARMS_REPOSITORY_TOKEN,
  FarmsRepository,
} from '../../ports/farms.repository';
import { FarmNotFoundException } from '../../../domain/exceptions/farm-not-found/farm-not-found.exception';
import { FarmEntity } from '../../../domain/entities/farm.entity';
import {
  FARMS_CACHE_REPOSITORY_TOKEN,
  FarmsCacheRepository,
} from '../../ports/farms-cache.repository';

/**
 * Query handler for GetFarmByIdQuery
 */
@QueryHandler(GetFarmByIdQuery)
export class GetFarmByIdQueryHandler
  implements IQueryHandler<GetFarmByIdQuery>
{
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepository,
    @Inject(FARMS_CACHE_REPOSITORY_TOKEN)
    private readonly farmsCacheRepository: FarmsCacheRepository,
  ) {}

  /**
   * Handles the GetFarmByIdQuery
   * @param query - The query to handle
   * @returns The FarmEntity if found
   * @throws FarmNotFoundException if not found
   */
  async execute(query: GetFarmByIdQuery): Promise<FarmEntity> {
    let farm = await this.farmsCacheRepository.get(query.farmId);
    if (!farm) {
      // If not in cache, fetch from repository
      farm = await this.farmsRepository.findById(query.farmId);
      await this.farmsCacheRepository.set(query.farmId, farm);
    }
    if (!farm) {
      throw new FarmNotFoundException(query.farmId);
    }
    // If found in cache, return it
    return farm;
  }
}
