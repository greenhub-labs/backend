import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetUserByIdRequestDto } from '../dtos/requests/get-user-by-id.request.dto';
import { UserResponseDto } from '../dtos/responses/user.response.dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../../../application/queries/get-user-by-id/get-user-by-id.query';

/**
 * GraphQL resolver for User
 */
@Resolver(() => UserResponseDto)
export class UserResolver {
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * Get a user by their unique identifier
   * @param input - Input DTO containing the user ID
   */
  @Query(() => UserResponseDto, { name: 'getUserById' })
  async getUserById(
    @Args('input') input: GetUserByIdRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.queryBus.execute(new GetUserByIdQuery(input.id));
    // Map the domain user to the response DTO
    return {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      deletedAt: user.deletedAt,
    };
  }
}
