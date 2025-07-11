import { Auth } from '../../../../domain/entities/auth.entity';
import { AuthEmailValueObject } from '../../../../domain/value-objects/auth-email/auth-email.value-object';
import { AuthPasswordValueObject } from '../../../../domain/value-objects/auth-password/auth-password.value-object';
import { AuthPrimitive } from '../../../../domain/primitives/auth.primitive';

/**
 * AuthRedisEntity
 *
 * Maps between Redis cached data and domain Auth entity.
 * Handles serialization/deserialization for Redis storage of authentication data.
 *
 * @author GreenHub Labs
 */
export class AuthRedisEntity {
  /**
   * Converts a Redis cached string to a domain Auth entity
   *
   * @param redisData - The Redis cached JSON string
   * @returns Domain Auth entity
   */
  static fromRedis(redisData: string): Auth {
    const authData: AuthPrimitive = JSON.parse(redisData);

    return new Auth({
      id: authData.id,
      userId: authData.userId,
      email: new AuthEmailValueObject(authData.email),
      password: AuthPasswordValueObject.fromHash(authData.password),
      phone: authData.phone,
      isVerified: authData.isVerified,
      lastLogin: authData.lastLogin ? new Date(authData.lastLogin) : undefined,
      createdAt: new Date(authData.createdAt),
      updatedAt: new Date(authData.updatedAt),
      deletedAt: authData.deletedAt ? new Date(authData.deletedAt) : undefined,
      emitEvent: false, // Don't emit events when reconstructing from cache
    });
  }

  /**
   * Converts a domain Auth entity to a Redis-storable JSON string
   *
   * @param auth - The domain Auth entity
   * @returns JSON string ready for Redis storage
   */
  static toRedis(auth: Auth): string {
    const primitive: AuthPrimitive = {
      id: auth.id,
      userId: auth.userId,
      email: auth.email.value,
      password: auth.password.value,
      phone: auth.phone,
      isVerified: auth.isVerified,
      lastLogin: auth.lastLogin?.toISOString(),
      createdAt: auth.createdAt.toISOString(),
      updatedAt: auth.updatedAt.toISOString(),
      deletedAt: auth.deletedAt?.toISOString(),
    };

    return JSON.stringify(primitive);
  }

  /**
   * Converts multiple domain Auth entities to Redis-storable JSON strings
   *
   * @param auths - Array of domain Auth entities
   * @returns Array of JSON strings ready for Redis storage
   */
  static toRedisMany(auths: Auth[]): string[] {
    return auths.map((auth) => this.toRedis(auth));
  }

  /**
   * Converts multiple Redis cached strings to domain Auth entities
   *
   * @param redisDataArray - Array of Redis cached JSON strings
   * @returns Array of domain Auth entities
   */
  static fromRedisMany(redisDataArray: string[]): Auth[] {
    return redisDataArray
      .filter((data) => data !== null && data !== undefined)
      .map((data) => this.fromRedis(data));
  }

  /**
   * Generates a standardized cache key for auth by user ID
   *
   * @param userId - The user ID
   * @returns Standardized cache key
   */
  static generateUserCacheKey(userId: string): string {
    return `auth:user:${userId}`;
  }

  /**
   * Generates a standardized cache key for auth by email
   *
   * @param email - The email address
   * @returns Standardized cache key
   */
  static generateEmailCacheKey(email: string): string {
    return `auth:email:${email.toLowerCase()}`;
  }

  /**
   * Generates a standardized cache key for session data
   *
   * @param sessionId - The session ID
   * @returns Standardized cache key
   */
  static generateSessionCacheKey(sessionId: string): string {
    return `auth:session:${sessionId}`;
  }

  /**
   * Generates standardized cache keys for multiple user IDs
   *
   * @param userIds - Array of user IDs
   * @returns Array of standardized cache keys
   */
  static generateUserCacheKeys(userIds: string[]): string[] {
    return userIds.map((id) => this.generateUserCacheKey(id));
  }

  /**
   * Generates standardized cache keys for multiple emails
   *
   * @param emails - Array of email addresses
   * @returns Array of standardized cache keys
   */
  static generateEmailCacheKeys(emails: string[]): string[] {
    return emails.map((email) => this.generateEmailCacheKey(email));
  }

  /**
   * Extracts user ID from a user cache key
   *
   * @param cacheKey - The cache key (e.g., "auth:user:123")
   * @returns User ID or null if invalid format
   */
  static extractUserIdFromCacheKey(cacheKey: string): string | null {
    const match = cacheKey.match(/^auth:user:(.+)$/);
    return match ? match[1] : null;
  }

  /**
   * Extracts email from an email cache key
   *
   * @param cacheKey - The cache key (e.g., "auth:email:user@example.com")
   * @returns Email or null if invalid format
   */
  static extractEmailFromCacheKey(cacheKey: string): string | null {
    const match = cacheKey.match(/^auth:email:(.+)$/);
    return match ? match[1] : null;
  }

  /**
   * Extracts session ID from a session cache key
   *
   * @param cacheKey - The cache key (e.g., "auth:session:abc123")
   * @returns Session ID or null if invalid format
   */
  static extractSessionIdFromCacheKey(cacheKey: string): string | null {
    const match = cacheKey.match(/^auth:session:(.+)$/);
    return match ? match[1] : null;
  }
}
