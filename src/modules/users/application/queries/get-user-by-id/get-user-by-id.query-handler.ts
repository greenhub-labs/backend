import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { Inject } from '@nestjs/common';
import {
  UserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../ports/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';

/**
 * Query handler for getting a user by id
 */
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQuery>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Execute the query to get a user by ID
   * @param query - The query containing the user ID
   * @returns The User domain entity
   */
  async execute(query: GetUserByIdQuery): Promise<User> {
    const user = await this.userRepository.findById(query.id);
    if (!user) {
      throw new UserNotFoundException(query.id);
    }
    return user;
  }
}
