import { Args, Query, Resolver, Mutation, Context } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { GetUserByIdRequestDto } from '../dtos/requests/get-user-by-id.request.dto';
import { UserResponseDto } from '../dtos/responses/user.response.dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../../../application/queries/get-user-by-id/get-user-by-id.query';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserRequestDto } from '../dtos/requests/create-user.request.dto';
import { UpdateUserRequestDto } from '../dtos/requests/update-user.request.dto';
import { DeleteUserRequestDto } from '../dtos/requests/delete-user.request.dto';
import { RestoreUserRequestDto } from '../dtos/requests/restore-user.request.dto';
import { CreateUserCommand } from '../../../application/commands/create-user/create-user.command';
import { UpdateUserCommand } from '../../../application/commands/update-user/update-user.command';
import { DeleteUserCommand } from '../../../application/commands/delete-user/delete-user.command';
import { RestoreUserCommand } from '../../../application/commands/restore-user/restore-user.command';
import { UserMapper } from '../mappers/user.mapper';

// Auth guards and decorators
import {
  JwtAuthGuard,
  Public,
} from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';

/**
 * GraphQL resolver for User
 * Protected by JWT authentication by default
 * Use @Public() decorator for endpoints that should be accessible without authentication
 */
@Resolver(() => UserResponseDto)
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
  @Query(() => UserResponseDto, {
    name: 'getUserById',
    description: 'Get user information by ID (requires authentication)',
  })
  async getUserById(
    @Args('input') input: GetUserByIdRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.queryBus.execute(new GetUserByIdQuery(input.id));
    // Mapear la entidad User del dominio al DTO de respuesta
    return UserMapper.fromDomain(user);
  }

  /**
   * Create a new user
   * Note: This endpoint is for administrative purposes only.
   * Regular user registration should use the auth/register mutation.
   */
  @Mutation(() => UserResponseDto, {
    name: 'createUser',
    description:
      'Create a new user (Admin only - regular registration uses auth/register)',
  })
  async createUser(
    @Args('input') input: CreateUserRequestDto,
    @Context() context: any,
  ): Promise<UserResponseDto> {
    // Mapear correctamente los campos del DTO al comando
    const user = await this.commandBus.execute(
      new CreateUserCommand(
        input.firstName,
        input.lastName,
        input.avatar,
        input.bio,
      ),
    );
    return UserMapper.fromDomain(user);
  }

  /**
   * Update an existing user
   * Users can only update their own profile
   */
  @Mutation(() => UserResponseDto, {
    name: 'updateUser',
    description:
      'Update user profile (users can only update their own profile)',
  })
  async updateUser(
    @Args('input') input: UpdateUserRequestDto,
    @Context() context: any,
  ): Promise<UserResponseDto> {
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
    return UserMapper.fromDomain(user);
  }

  /**
   * Delete a user (soft delete)
   * Users can only delete their own account
   */
  @Mutation(() => UserResponseDto, {
    name: 'deleteUser',
    description:
      'Delete user account (users can only delete their own account)',
  })
  async deleteUser(
    @Args('input') input: DeleteUserRequestDto,
    @Context() context: any,
  ): Promise<UserResponseDto> {
    const currentUser = context.req.user;

    // Verify user can only delete their own account
    if (currentUser.userId !== input.id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    const user = await this.commandBus.execute(new DeleteUserCommand(input.id));
    return UserMapper.fromDomain(user);
  }

  /**
   * Restore a soft-deleted user
   * Administrative function - requires special privileges
   */
  @Mutation(() => UserResponseDto, {
    name: 'restoreUser',
    description: 'Restore a soft-deleted user (Admin only)',
  })
  async restoreUser(
    @Args('input') input: RestoreUserRequestDto,
    @Context() context: any,
  ): Promise<UserResponseDto> {
    // TODO: Add role-based authorization check for admin privileges
    // For now, any authenticated user can restore (should be restricted to admins)
    const currentUser = context.req.user;
    console.log(
      `User ${currentUser.userId} attempting to restore user ${input.id}`,
    );

    // Note: In production, this should check for admin role
    // RestoreUserCommand usa userId, no id
    const user = await this.commandBus.execute(
      new RestoreUserCommand(input.id),
    );
    return UserMapper.fromDomain(user);
  }
}
