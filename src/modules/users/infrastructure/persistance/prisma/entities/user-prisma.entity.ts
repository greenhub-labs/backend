import { User } from '../../../../domain/entities/user.entity';
import { UserIdValueObject } from '../../../../domain/value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../../../../domain/value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../../../domain/value-objects/user-avatar-url/user-avatar-url.value-object';

/**
 * UserPrismaEntity
 * Maps between Prisma user model and domain User entity
 */
export class UserPrismaEntity {
  /**
   * Converts a Prisma user record to a domain User entity
   * @param prismaUser - The Prisma user record
   */
  static fromPrisma(prismaUser: any): User {
    return new User({
      id: new UserIdValueObject(prismaUser.id),
      firstName: prismaUser.firstName
        ? new UserNameValueObject(prismaUser.firstName)
        : undefined,
      lastName: prismaUser.lastName
        ? new UserNameValueObject(prismaUser.lastName)
        : undefined,
      avatar: prismaUser.avatar
        ? new UserAvatarUrlValueObject(prismaUser.avatar)
        : undefined,
      bio: prismaUser.bio,
      isActive: prismaUser.isActive,
      isDeleted: prismaUser.isDeleted,
      createdAt: new Date(prismaUser.createdAt),
      updatedAt: new Date(prismaUser.updatedAt),
      deletedAt: prismaUser.deletedAt
        ? new Date(prismaUser.deletedAt)
        : undefined,
      emitEvent: false,
    });
  }

  /**
   * Converts a domain User entity to a Prisma user record
   * @param user - The domain User entity
   */
  static toPrisma(user: User): any {
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
