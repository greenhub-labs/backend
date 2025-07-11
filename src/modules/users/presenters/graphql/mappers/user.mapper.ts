import { User } from '../../../domain/entities/user.entity';
import { UserResponseDto } from '../dtos/responses/user.response.dto';

export class UserMapper {
  /**
   * Maps a User domain entity to a UserResponseDto
   * @param user - User domain entity
   * @returns UserResponseDto with all value objects as primitives
   */
  static fromDomain(user: User): UserResponseDto {
    return {
      id: user.id.value,
      firstName: user.firstName?.value,
      lastName: user.lastName?.value,
      email: (user as any).email?.value, // Only if available (for Auth context)
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
