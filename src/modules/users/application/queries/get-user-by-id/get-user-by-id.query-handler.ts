import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { UserRepository } from '../../ports/user.repository';
import { UserDto } from '../../dtos/user.dto';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';

/**
 * Query handler for getting a user by id
 */
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
  implements IQueryHandler<GetUserByIdQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUserByIdQuery): Promise<UserDto> {
    const user = await this.userRepository.findById(query.id);
    if (!user) {
      throw new UserNotFoundException(query.id);
    }
    return new UserDto(
      user.id.value,
      user.firstName?.value,
      user.lastName?.value,
      user.avatar?.value,
      user.bio,
      user.isActive,
      user.isDeleted,
      user.createdAt.toISOString(),
      user.updatedAt.toISOString(),
    );
  }
}
