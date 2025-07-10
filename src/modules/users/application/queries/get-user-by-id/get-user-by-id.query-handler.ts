import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
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
  ) {}

  /**
   * Execute the query to get a user by ID
   * Implements cache-aside pattern for optimal performance
   * @param query - The query containing the user ID
   * @returns The User domain entity
   */
  async execute(query: GetUserByIdQuery): Promise<User> {
    // 1. Check cache first (fast path)
    let user = await this.userCacheRepository.get(query.id);

    if (user) {
      // Cache hit - return cached user
      return user;
    }

    // 2. Cache miss - fetch from database
    user = await this.userRepository.findById(query.id);
    if (!user) {
      throw new UserNotFoundException(query.id);
    }

    // 3. Store in cache for future requests
    await this.userCacheRepository.set(query.id, user);

    return user;
  }
}
