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
import { User } from 'src/modules/users/domain/entities/user.entity';
import { FarmMembershipsRepository } from '../../ports/farm-memberships.repository';
import { FarmMemberWithRole } from '../../ports/farm-memberships.repository';
import { FarmDetailsResult } from '../../dtos/farm-details.result';

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
    @Inject('FARM_MEMBERSHIPS_REPOSITORY_TOKEN')
    private readonly farmMembershipsRepository: FarmMembershipsRepository,
  ) {}

  /**
   * Handles the GetFarmByIdQuery
   * @param query - The query to handle
   * @returns The FarmEntity if found
   * @throws FarmNotFoundException if not found
   */
  async execute(query: GetFarmByIdQuery): Promise<FarmDetailsResult> {
    let farm = await this.farmsCacheRepository.get(query.farmId);
    if (!farm) {
      // If not in cache, fetch from repository
      farm = await this.farmsRepository.findById(query.farmId);
      await this.farmsCacheRepository.set(query.farmId, farm);
    }
    if (!farm) {
      throw new FarmNotFoundException(query.farmId);
    }
    // Obtener los usuarios miembros de la farm
    const members = await this.farmMembershipsRepository.getUsersByFarmId(
      query.farmId,
    );
    // Asignar los miembros al aggregate si es FarmAggregate
    if ('setMembers' in farm && typeof farm.setMembers === 'function') {
      (farm as any).setMembers(members.map((m) => m.user));
    }
    return new FarmDetailsResult(farm, members);
  }
}
