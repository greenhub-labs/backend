import { IQueryHandler, QueryHandler, QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { Inject } from '@nestjs/common';
import {
  UserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../ports/user.repository';
import {
  UserCacheRepository,
  USER_CACHE_REPOSITORY_TOKEN,
} from '../../ports/user-cache.repository';
import { User } from '../../../domain/entities/user.entity';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';
import { FARM_MEMBERSHIP_ROLES } from 'src/shared/domain/constants/farm-membership-roles.constant';
import { GetFarmsForUserQuery } from '../../../../farms/application/queries/get-farms-for-user/get-farms-for-user.query';
import {
  UserDetailsResult,
  UserFarmMembership,
} from '../../dtos/user-details.result';

/**
 * Query handler for getting a user by id
 * Implements cache-aside pattern: check cache first, then database
 */
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQuery>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(USER_CACHE_REPOSITORY_TOKEN)
    private readonly userCacheRepository: UserCacheRepository,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Execute the query to get a user by ID
   * Implements cache-aside pattern for optimal performance
   * @param query - The query containing the user ID
   * @returns The User domain entity
   */
  async execute(query: GetUserByIdQuery): Promise<UserDetailsResult> {
    // 1. Get the user from the cache
    const user = await this.userCacheRepository.get(query.id);
    if (!user) {
      // 2. Get the user from the database
      const user = await this.userRepository.findById(query.id);
      if (!user) throw new UserNotFoundException(query.id);
      // 3. Save the user to the cache
      await this.userCacheRepository.set(user.id.value, user);
    }

    // 4. Get the farms for the user
    const farms = await this.queryBus.execute(
      new GetFarmsForUserQuery(query.id),
    );

    const farmMemberships = farms.map(
      (farm) => new UserFarmMembership(farm.farmId, farm.farmName, farm.role),
    );
    return new UserDetailsResult(user, farmMemberships);
  }
}
