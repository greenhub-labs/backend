import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { User } from '../../entities/user.entity';
import { UserIdValueObject } from '../../value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../../value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserPrimitive } from '../../primitives/user.primitive';

/**
 * Factory class for creating User domain objects from primitive data
 */
@Injectable()
export class UserFactory {
  /**
   * Creates a new User domain object from primitive data
   * @param data - The primitive data to create the User from
   * @returns A new User domain object
   */
  create(data: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
  }): User {
    return new User({
      id: new UserIdValueObject(randomUUID()),
      firstName: data.firstName
        ? new UserNameValueObject(data.firstName)
        : undefined,
      lastName: data.lastName
        ? new UserNameValueObject(data.lastName)
        : undefined,
      avatar: data.avatar
        ? new UserAvatarUrlValueObject(data.avatar)
        : undefined,
      bio: data.bio,
      isActive: true,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  /**
   * Reconstructs a User domain object from its primitive representation
   * @param primitives - The primitive object to reconstruct the User from
   * @returns A new User domain object
   */
  static fromPrimitives(primitives: UserPrimitive): User {
    return new User({
      id: new UserIdValueObject(primitives.id),
      firstName: primitives.firstName
        ? new UserNameValueObject(primitives.firstName)
        : undefined,
      lastName: primitives.lastName
        ? new UserNameValueObject(primitives.lastName)
        : undefined,
      bio: primitives.bio,
      avatar: primitives.avatar
        ? new UserAvatarUrlValueObject(primitives.avatar)
        : undefined,
      isActive: primitives.isActive,
      isDeleted: primitives.isDeleted,
      createdAt: new Date(primitives.createdAt),
      updatedAt: new Date(primitives.updatedAt),
      deletedAt: primitives.deletedAt
        ? new Date(primitives.deletedAt)
        : undefined,
    });
  }
}
