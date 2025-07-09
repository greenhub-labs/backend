import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
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

/**
 * GraphQL resolver for User
 */
@Resolver(() => UserResponseDto)
export class UserResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Get a user by their unique identifier
   * @param input - Input DTO containing the user ID
   */
  @Query(() => UserResponseDto, { name: 'getUserById' })
  async getUserById(
    @Args('input') input: GetUserByIdRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.queryBus.execute(new GetUserByIdQuery(input.id));
    // Mapear la entidad User del dominio al DTO de respuesta
    return {
      id: user.id.value,
      firstName: user.firstName?.value,
      lastName: user.lastName?.value,
      avatar: user.avatar?.value,
      bio: user.bio,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  /**
   * Create a new user
   */
  @Mutation(() => UserResponseDto, { name: 'createUser' })
  async createUser(
    @Args('input') input: CreateUserRequestDto,
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
    return {
      id: user.id.value,
      firstName: user.firstName?.value,
      lastName: user.lastName?.value,
      avatar: user.avatar?.value,
      bio: user.bio,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  /**
   * Update an existing user
   */
  @Mutation(() => UserResponseDto, { name: 'updateUser' })
  async updateUser(
    @Args('input') input: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
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
    return {
      id: user.id.value,
      firstName: user.firstName?.value,
      lastName: user.lastName?.value,
      avatar: user.avatar?.value,
      bio: user.bio,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  /**
   * Delete a user (soft delete)
   */
  @Mutation(() => UserResponseDto, { name: 'deleteUser' })
  async deleteUser(
    @Args('input') input: DeleteUserRequestDto,
  ): Promise<UserResponseDto> {
    const user = await this.commandBus.execute(new DeleteUserCommand(input.id));
    return {
      id: user.id.value,
      firstName: user.firstName?.value,
      lastName: user.lastName?.value,
      avatar: user.avatar?.value,
      bio: user.bio,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  /**
   * Restore a soft-deleted user
   */
  @Mutation(() => UserResponseDto, { name: 'restoreUser' })
  async restoreUser(
    @Args('input') input: RestoreUserRequestDto,
  ): Promise<UserResponseDto> {
    // RestoreUserCommand usa userId, no id
    const user = await this.commandBus.execute(
      new RestoreUserCommand(input.id),
    );
    return {
      id: user.id.value,
      firstName: user.firstName?.value,
      lastName: user.lastName?.value,
      avatar: user.avatar?.value,
      bio: user.bio,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}
