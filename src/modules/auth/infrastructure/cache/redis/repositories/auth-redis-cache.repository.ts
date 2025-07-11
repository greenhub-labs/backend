import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { AuthCacheRepository } from '../../../../application/ports/auth-cache.repository';
import { Auth } from '../../../../domain/entities/auth.entity';
import { AuthRedisEntity } from '../entities/auth-redis.entity';
import { REDIS_CLIENT } from '../../../../../../shared/infrastructure/redis/provider/redis.provider';

/**
 * AuthRedisCacheRepository
 *
 * Redis implementation of the AuthCacheRepository interface.
 * Handles caching operations for Auth entities using Redis with multiple indexing strategies:
 * - By User ID (primary key)
 * - By Email (secondary key for login)
 * - Session management
 *
 * @author GreenHub Labs
 */
@Injectable()
export class AuthRedisCacheRepository implements AuthCacheRepository {
  private readonly DEFAULT_TTL = 3600; // 1 hour in seconds
  private readonly SESSION_TTL = 900; // 15 minutes for sessions
  private readonly AUTH_USER_PREFIX = 'auth:user:';
  private readonly AUTH_EMAIL_PREFIX = 'auth:email:';
  private readonly SESSION_PREFIX = 'auth:session:';

  /**
   * Creates a new AuthRedisCacheRepository instance
   *
   * @param redis - The Redis client instance for cache operations
   */
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * Sets an auth record in the cache by user ID
   *
   * @param userId - User ID (primary cache key)
   * @param auth - Auth entity to cache
   * @param ttl - Time to live in seconds (optional, defaults to 1 hour)
   * @returns Promise resolving when the operation is complete
   */
  async setByUserId(userId: string, auth: Auth, ttl?: number): Promise<void> {
    const cacheKey = AuthRedisEntity.generateUserCacheKey(userId);
    const authData = AuthRedisEntity.toRedis(auth);
    const expirationTime = ttl || this.DEFAULT_TTL;

    await this.redis.setex(cacheKey, expirationTime, authData);
  }

  /**
   * Gets an auth record from the cache by user ID
   *
   * @param userId - User ID
   * @returns Promise resolving to the Auth entity if found, null otherwise
   */
  async getByUserId(userId: string): Promise<Auth | null> {
    const cacheKey = AuthRedisEntity.generateUserCacheKey(userId);
    const authData = await this.redis.get(cacheKey);

    if (!authData) {
      return null;
    }

    try {
      return AuthRedisEntity.fromRedis(authData);
    } catch (error) {
      // If deserialization fails, remove the corrupted cache entry
      await this.deleteByUserId(userId);
      return null;
    }
  }

  /**
   * Sets an auth record in the cache by email
   *
   * @param email - Email address (secondary cache key)
   * @param auth - Auth entity to cache
   * @param ttl - Time to live in seconds (optional, defaults to 1 hour)
   * @returns Promise resolving when the operation is complete
   */
  async setByEmail(email: string, auth: Auth, ttl?: number): Promise<void> {
    const cacheKey = AuthRedisEntity.generateEmailCacheKey(email);
    const authData = AuthRedisEntity.toRedis(auth);
    const expirationTime = ttl || this.DEFAULT_TTL;

    await this.redis.setex(cacheKey, expirationTime, authData);
  }

  /**
   * Gets an auth record from the cache by email
   *
   * @param email - Email address
   * @returns Promise resolving to the Auth entity if found, null otherwise
   */
  async getByEmail(email: string): Promise<Auth | null> {
    const cacheKey = AuthRedisEntity.generateEmailCacheKey(email);
    const authData = await this.redis.get(cacheKey);

    if (!authData) {
      return null;
    }

    try {
      return AuthRedisEntity.fromRedis(authData);
    } catch (error) {
      // If deserialization fails, remove the corrupted cache entry
      await this.deleteByEmail(email);
      return null;
    }
  }

  /**
   * Deletes an auth record from the cache by user ID
   *
   * @param userId - User ID
   * @returns Promise resolving when the operation is complete
   */
  async deleteByUserId(userId: string): Promise<void> {
    const cacheKey = AuthRedisEntity.generateUserCacheKey(userId);
    await this.redis.del(cacheKey);
  }

  /**
   * Deletes an auth record from the cache by email
   *
   * @param email - Email address
   * @returns Promise resolving when the operation is complete
   */
  async deleteByEmail(email: string): Promise<void> {
    const cacheKey = AuthRedisEntity.generateEmailCacheKey(email);
    await this.redis.del(cacheKey);
  }

  /**
   * Deletes all cache entries for a specific auth record (by userId and email)
   *
   * @param userId - User ID
   * @param email - Email address
   * @returns Promise resolving when the operation is complete
   */
  async deleteAuth(userId: string, email: string): Promise<void> {
    const userCacheKey = AuthRedisEntity.generateUserCacheKey(userId);
    const emailCacheKey = AuthRedisEntity.generateEmailCacheKey(email);

    await this.redis.del(userCacheKey, emailCacheKey);
  }

  /**
   * Checks if an auth record exists in cache by user ID
   *
   * @param userId - User ID
   * @returns Promise resolving to true if exists, false otherwise
   */
  async existsByUserId(userId: string): Promise<boolean> {
    const cacheKey = AuthRedisEntity.generateUserCacheKey(userId);
    const result = await this.redis.exists(cacheKey);
    return result === 1;
  }

  /**
   * Checks if an auth record exists in cache by email
   *
   * @param email - Email address
   * @returns Promise resolving to true if exists, false otherwise
   */
  async existsByEmail(email: string): Promise<boolean> {
    const cacheKey = AuthRedisEntity.generateEmailCacheKey(email);
    const result = await this.redis.exists(cacheKey);
    return result === 1;
  }

  /**
   * Clears all auth cache entries
   *
   * @returns Promise resolving when the operation is complete
   */
  async clear(): Promise<void> {
    const patterns = [
      `${this.AUTH_USER_PREFIX}*`,
      `${this.AUTH_EMAIL_PREFIX}*`,
      `${this.SESSION_PREFIX}*`,
    ];

    for (const pattern of patterns) {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    }
  }

  /**
   * Sets session information in cache
   *
   * @param sessionId - Session identifier
   * @param sessionData - Session data to cache
   * @param ttl - Time to live in seconds (optional, defaults to 15 minutes)
   * @returns Promise resolving when the operation is complete
   */
  async setSession(
    sessionId: string,
    sessionData: any,
    ttl?: number,
  ): Promise<void> {
    const cacheKey = AuthRedisEntity.generateSessionCacheKey(sessionId);
    const dataString = JSON.stringify(sessionData);
    const expirationTime = ttl || this.SESSION_TTL;

    await this.redis.setex(cacheKey, expirationTime, dataString);
  }

  /**
   * Gets session information from cache
   *
   * @param sessionId - Session identifier
   * @returns Promise resolving to session data if found, null otherwise
   */
  async getSession(sessionId: string): Promise<any | null> {
    const cacheKey = AuthRedisEntity.generateSessionCacheKey(sessionId);
    const sessionData = await this.redis.get(cacheKey);

    if (!sessionData) {
      return null;
    }

    try {
      return JSON.parse(sessionData);
    } catch (error) {
      // If deserialization fails, remove the corrupted cache entry
      await this.deleteSession(sessionId);
      return null;
    }
  }

  /**
   * Deletes a session from cache
   *
   * @param sessionId - Session identifier
   * @returns Promise resolving when the operation is complete
   */
  async deleteSession(sessionId: string): Promise<void> {
    const cacheKey = AuthRedisEntity.generateSessionCacheKey(sessionId);
    await this.redis.del(cacheKey);
  }

  /**
   * Gets all cached auth keys matching a pattern
   *
   * @param pattern - Pattern to match (e.g., "auth:user:*")
   * @returns Promise resolving to array of matching keys
   */
  async getKeys(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern);
  }

  /**
   * Sets the TTL for an existing cache entry
   *
   * @param key - Cache key
   * @param ttl - Time to live in seconds
   * @returns Promise resolving when the operation is complete
   */
  async expire(key: string, ttl: number): Promise<void> {
    await this.redis.expire(key, ttl);
  }

  /**
   * Cache an auth entity in both user and email indices
   *
   * @param auth - Auth entity to cache
   * @param ttl - Time to live in seconds (optional)
   * @returns Promise resolving when the operation is complete
   */
  async cacheAuth(auth: Auth, ttl?: number): Promise<void> {
    const expirationTime = ttl || this.DEFAULT_TTL;

    // Cache by both user ID and email for fast lookup in different scenarios
    await Promise.all([
      this.setByUserId(auth.userId, auth, expirationTime),
      this.setByEmail(auth.email.value, auth, expirationTime),
    ]);
  }

  /**
   * Update an auth entity in cache (both indices)
   *
   * @param auth - Updated auth entity
   * @param ttl - Time to live in seconds (optional)
   * @returns Promise resolving when the operation is complete
   */
  async updateAuth(auth: Auth, ttl?: number): Promise<void> {
    await this.cacheAuth(auth, ttl);
  }

  /**
   * Gets cache statistics for monitoring
   *
   * @returns Promise resolving to cache statistics
   */
  async getStats(): Promise<{
    totalKeys: number;
    userKeys: number;
    emailKeys: number;
    sessionKeys: number;
    memoryUsage: string;
  }> {
    const [userKeys, emailKeys, sessionKeys, info] = await Promise.all([
      this.redis.keys(`${this.AUTH_USER_PREFIX}*`),
      this.redis.keys(`${this.AUTH_EMAIL_PREFIX}*`),
      this.redis.keys(`${this.SESSION_PREFIX}*`),
      this.redis.info('memory'),
    ]);

    const memoryMatch = info.match(/used_memory_human:(.+)/);
    const memoryUsage = memoryMatch ? memoryMatch[1].trim() : 'Unknown';

    return {
      totalKeys: userKeys.length + emailKeys.length + sessionKeys.length,
      userKeys: userKeys.length,
      emailKeys: emailKeys.length,
      sessionKeys: sessionKeys.length,
      memoryUsage,
    };
  }

  /**
   * Performs a health check on the Redis connection
   *
   * @returns Promise resolving to true if healthy, false otherwise
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.redis.ping();
      return response === 'PONG';
    } catch {
      return false;
    }
  }
}
