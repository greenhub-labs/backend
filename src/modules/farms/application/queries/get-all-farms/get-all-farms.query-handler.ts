import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllFarmsQuery } from './get-all-farms.query';
import {
  FARMS_REPOSITORY_TOKEN,
  FarmsRepository,
} from '../../ports/farms.repository';
import { FarmEntity } from '../../../domain/entities/farm.entity';
import {
  FARMS_CACHE_REPOSITORY_TOKEN,
  FarmsCacheRepository,
} from '../../ports/farms-cache.repository';
import {
  FarmMembershipsRepository,
  FarmMemberWithRole,
} from '../../ports/farm-memberships.repository';
import { FarmDetailsResult } from '../../dtos/farm-details.result';

/**
 * Query handler for GetAllFarmsQuery
 */
@QueryHandler(GetAllFarmsQuery)
export class GetAllFarmsQueryHandler
  implements IQueryHandler<GetAllFarmsQuery>
{
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepository,
    @Inject(FARMS_CACHE_REPOSITORY_TOKEN)
    private readonly farmsCacheRepository: FarmsCacheRepository,
    @Inject('FARM_MEMBERSHIPS_REPOSITORY_TOKEN')
    private readonly farmMembershipsRepository: FarmMembershipsRepository,
  ) {}

  /**
   * Handles the GetAllFarmsQuery
   * @param query - The query to handle
   * @returns Array of FarmEntity
   */
  async execute(query: GetAllFarmsQuery): Promise<FarmDetailsResult[]> {
    const farms = await this.farmsRepository.findAll();
    const results = await Promise.all(
      farms.map(async (farm) => {
        const members = await this.farmMembershipsRepository.getUsersByFarmId(
          farm.id.value,
        );
        return new FarmDetailsResult(farm, members);
      }),
    );
    return results;
  }
}
