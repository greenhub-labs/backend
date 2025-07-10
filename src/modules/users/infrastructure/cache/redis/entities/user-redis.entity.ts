import { User } from '../../../../domain/entities/user.entity';
import { UserIdValueObject } from '../../../../domain/value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../../../../domain/value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../../../domain/value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserPrimitive } from '../../../../domain/primitives/user.primitive';

/**
 * UserRedisEntity
 * Maps between Redis cached data and domain User entity
 * Handles serialization/deserialization for Redis storage
 */
export class UserRedisEntity {
  /**
   * Converts a Redis cached string to a domain User entity
   * @param redisData - The Redis cached JSON string
   * @returns Domain User entity
   */
  static fromRedis(redisData: string): User {
    const userData: UserPrimitive = JSON.parse(redisData);

    return new User({
      id: new UserIdValueObject(userData.id),
      firstName: userData.firstName
        ? new UserNameValueObject(userData.firstName)
        : undefined,
      lastName: userData.lastName
        ? new UserNameValueObject(userData.lastName)
        : undefined,
      avatar: userData.avatar
        ? new UserAvatarUrlValueObject(userData.avatar)
        : undefined,
      bio: userData.bio,
      isActive: userData.isActive,
      isDeleted: userData.isDeleted,
      createdAt: new Date(userData.createdAt),
      updatedAt: new Date(userData.updatedAt),
      deletedAt: userData.deletedAt ? new Date(userData.deletedAt) : undefined,
      emitEvent: false, // Don't emit events when reconstructing from cache
    });
  }

  /**
   * Converts a domain User entity to a Redis-storable JSON string
   * @param user - The domain User entity
   * @returns JSON string ready for Redis storage
   */
  static toRedis(user: User): string {
    const primitive: UserPrimitive = {
      id: user.id.value,
      firstName: user.firstName?.value,
      lastName: user.lastName?.value,
      avatar: user.avatar?.value,
      bio: user.bio,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      deletedAt: user.deletedAt?.toISOString(),
    };

    return JSON.stringify(primitive);
  }

  /**
   * Converts multiple domain User entities to Redis-storable JSON strings
   * @param users - Array of domain User entities
   * @returns Array of JSON strings ready for Redis storage
   */
  static toRedisMany(users: User[]): string[] {
    return users.map((user) => this.toRedis(user));
  }

  /**
   * Converts multiple Redis cached strings to domain User entities
   * @param redisDataArray - Array of Redis cached JSON strings
   * @returns Array of domain User entities
   */
  static fromRedisMany(redisDataArray: string[]): User[] {
    return redisDataArray
      .filter((data) => data !== null && data !== undefined)
      .map((data) => this.fromRedis(data));
  }

  /**
   * Generates a standardized cache key for a user
   * @param userId - The user ID
   * @returns Standardized cache key
   */
  static generateCacheKey(userId: string): string {
    return `user:${userId}`;
  }

  /**
   * Generates standardized cache keys for multiple users
   * @param userIds - Array of user IDs
   * @returns Array of standardized cache keys
   */
  static generateCacheKeys(userIds: string[]): string[] {
    return userIds.map((id) => this.generateCacheKey(id));
  }

  /**
   * Extracts user ID from a cache key
   * @param cacheKey - The cache key (e.g., "user:123")
   * @returns User ID or null if invalid format
   */
  static extractUserIdFromCacheKey(cacheKey: string): string | null {
    const match = cacheKey.match(/^user:(.+)$/);
    return match ? match[1] : null;
  }
}
