import { UserIdValueObject } from '../value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserPrimitive } from '../primitives/user.primitive';

/**
 * User Entity
 * Represents a system user in the domain (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
export class User {
  /** Unique user identifier (UUID) */
  public readonly id: UserIdValueObject;
  /** First name (optional) */
  public readonly firstName?: UserNameValueObject;
  /** Last name (optional) */
  public readonly lastName?: UserNameValueObject;
  /** User bio or description */
  public readonly bio?: string;
  /** Avatar URL (optional) */
  public readonly avatar?: UserAvatarUrlValueObject;
  /** Whether the user is active */
  public readonly isActive: boolean;
  /** Soft delete flag */
  public readonly isDeleted: boolean;
  /** Creation date */
  public readonly createdAt: Date;
  /** Last update date */
  public readonly updatedAt: Date;

  /**
   * Creates a new User entity
   * @param props User properties (value objects and primitives)
   */
  constructor(props: {
    id: UserIdValueObject;
    firstName?: UserNameValueObject;
    lastName?: UserNameValueObject;
    bio?: string;
    avatar?: UserAvatarUrlValueObject;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.bio = props.bio;
    this.avatar = props.avatar;
    this.isActive = props.isActive;
    this.isDeleted = props.isDeleted;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Updates the user with the given data (immutable)
   * @param data - The data to update the user with
   * @returns A new User instance with the updated data
   */
  update(
    data: Partial<{
      firstName: string;
      lastName: string;
      avatar: string;
      bio: string;
    }>,
  ): User {
    return new User({
      id: this.id,
      firstName: data.firstName
        ? new UserNameValueObject(data.firstName)
        : this.firstName,
      lastName: data.lastName
        ? new UserNameValueObject(data.lastName)
        : this.lastName,
      avatar: data.avatar
        ? new UserAvatarUrlValueObject(data.avatar)
        : this.avatar,
      bio: data.bio ?? this.bio,
      isActive: this.isActive,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Converts the User instance to a primitive object
   * @returns A primitive object
   */
  toPrimitives(): UserPrimitive {
    return {
      id: this.id.value,
      firstName: this.firstName?.value,
      lastName: this.lastName?.value,
      bio: this.bio,
      avatar: this.avatar?.value,
      isActive: this.isActive,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
