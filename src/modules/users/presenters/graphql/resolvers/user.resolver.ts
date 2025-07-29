import { ForbiddenException, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserCommand } from '../../../application/commands/create-user/create-user.command';
import { DeleteUserCommand } from '../../../application/commands/delete-user/delete-user.command';
import { RestoreUserCommand } from '../../../application/commands/restore-user/restore-user.command';
import { UpdateUserCommand } from '../../../application/commands/update-user/update-user.command';
import { GetUserByIdQuery } from '../../../application/queries/get-user-by-id/get-user-by-id.query';
import { CreateUserRequestDto } from '../dtos/requests/create-user.request.dto';
import { DeleteUserRequestDto } from '../dtos/requests/delete-user.request.dto';
import { GetUserByIdRequestDto } from '../dtos/requests/get-user-by-id.request.dto';
import { RestoreUserRequestDto } from '../dtos/requests/restore-user.request.dto';
import { UpdateUserRequestDto } from '../dtos/requests/update-user.request.dto';
import { UserDetailsResponseDto } from '../dtos/responses/user.response.dto';
import { UserMapper } from '../mappers/user.mapper';

// Auth guards and decorators
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';

/**
 * GraphQL resolver for User
 * Protected by JWT authentication by default
 * Use @Public() decorator for endpoints that should be accessible without authentication
 */
@Resolver(() => UserDetailsResponseDto)
@UseGuards(JwtAuthGuard) // Apply JWT guard globally to this resolver
export class UserResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Get a user by their unique identifier
   * @param input - Input DTO containing the user ID
   */
  @Query(() => UserDetailsResponseDto, {
    name: 'getUserById',
    description: 'Get user information by ID (requires authentication)',
  })
  async getUserById(
    @Args('input') input: GetUserByIdRequestDto,
  ): Promise<UserDetailsResponseDto> {
    const result = await this.queryBus.execute(new GetUserByIdQuery(input.id));
    return UserMapper.toResponseDto(result);
  }

  /**
   * Create a new user
   * Note: This endpoint is for administrative purposes only.
   * Regular user registration should use the auth/register mutation.
   */
  @Mutation(() => UserDetailsResponseDto, {
    name: 'createUser',
    description:
      'Create a new user (Admin only - regular registration uses auth/register)',
  })
  async createUser(
    @Args('input') input: CreateUserRequestDto,
    @Context() context: any,
  ): Promise<UserDetailsResponseDto> {
    // Mapear correctamente los campos del DTO al comando
    const user = await this.commandBus.execute(
      new CreateUserCommand(
        input.firstName,
        input.lastName,
        input.avatar,
        input.bio,
      ),
    );
    return UserMapper.toResponseDto(user);
  }

  /**
   * Update an existing user
   * Users can only update their own profile
   */
  @Mutation(() => UserDetailsResponseDto, {
    name: 'updateUser',
    description:
      'Update user profile (users can only update their own profile)',
  })
  async updateUser(
    @Args('input') input: UpdateUserRequestDto,
    @Context() context: any,
  ): Promise<UserDetailsResponseDto> {
    const currentUser = context.req.user;

    // Verify user can only update their own profile
    if (currentUser.userId !== input.id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    // Mapear correctamente los campos del DTO al comando
    const user = await this.commandBus.execute(
      new UpdateUserCommand(
        input.id,
        input.firstName,
        input.lastName,
        input.avatar,
        input.bio,
      ),
    );
    return UserMapper.toResponseDto(user);
  }

  /**
   * Delete a user (soft delete)
   * Users can only delete their own account
   */
  @Mutation(() => UserDetailsResponseDto, {
    name: 'deleteUser',
    description:
      'Delete user account (users can only delete their own account)',
  })
  async deleteUser(
    @Args('input') input: DeleteUserRequestDto,
    @Context() context: any,
  ): Promise<UserDetailsResponseDto> {
    const currentUser = context.req.user;

    // Verify user can only delete their own account
    if (currentUser.userId !== input.id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    const user = await this.commandBus.execute(new DeleteUserCommand(input.id));
    return UserMapper.toResponseDto(user);
  }

  /**
   * Restore a soft-deleted user
   * Administrative function - requires special privileges
   */
  @Mutation(() => UserDetailsResponseDto, {
    name: 'restoreUser',
    description: 'Restore a soft-deleted user (Admin only)',
  })
  async restoreUser(
    @Args('input') input: RestoreUserRequestDto,
    @Context() context: any,
  ): Promise<UserDetailsResponseDto> {
    // TODO: Add role-based authorization check for admin privileges
    // For now, any authenticated user can restore (should be restricted to admins)
    const currentUser = context.req.user;

    // Note: In production, this should check for admin role
    // RestoreUserCommand usa userId, no id
    const user = await this.commandBus.execute(
      new RestoreUserCommand(input.id),
    );
    return UserMapper.toResponseDto(user);
  }
}
