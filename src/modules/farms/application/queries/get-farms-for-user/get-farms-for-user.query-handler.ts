import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FarmMembershipsRepository } from '../../ports/farm-memberships.repository';
import {
  FARMS_REPOSITORY_TOKEN,
  FarmsRepository,
} from '../../ports/farms.repository';
import { GetFarmsForUserQuery } from './get-farms-for-user.query';

@QueryHandler(GetFarmsForUserQuery)
export class GetFarmsForUserQueryHandler
  implements IQueryHandler<GetFarmsForUserQuery>
{
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepository,
    @Inject('FARM_MEMBERSHIPS_REPOSITORY_TOKEN')
    private readonly farmMembershipsRepository: FarmMembershipsRepository,
  ) {}

  async execute(
    query: GetFarmsForUserQuery,
  ): Promise<{ farmId: string; farmName: string; role: string }[]> {
    const memberships = await this.farmMembershipsRepository.getFarmsByUserId(
      query.userId,
    );
    return memberships.map((membership) => ({
      farmId: membership.farm.id.value,
      farmName: membership.farm.name.value,
      role: membership.role,
    }));
  }
}
