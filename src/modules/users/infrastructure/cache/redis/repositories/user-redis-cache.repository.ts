import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { UserCacheRepository } from '../../../../application/ports/user-cache.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserRedisEntity } from '../entities/user-redis.entity';
import { REDIS_CLIENT } from '../../../../../../shared/infrastructure/redis/provider/redis.provider';

/**
 * Redis implementation of the UserCacheRepository interface
 * Handles caching operations for User entities using Redis
 */
@Injectable()
export class UserRedisCacheRepository implements UserCacheRepository {
  private readonly DEFAULT_TTL = 3600; // 1 hour in seconds
  private readonly USER_CACHE_PREFIX = 'user:';

  /**
   * Creates a new UserRedisCacheRepository instance
   * @param redis - The Redis client instance for cache operations
   */
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * Sets a user in the cache
   * @param key - Cache key (typically user ID)
   * @param user - User entity to cache
   * @param ttl - Time to live in seconds (optional, defaults to 1 hour)
   * @returns Promise resolving when the operation is complete
   */
  async set(key: string, user: User, ttl?: number): Promise<void> {
    const cacheKey = this.buildCacheKey(key);
    const userData = UserRedisEntity.toRedis(user);
    const expirationTime = ttl || this.DEFAULT_TTL;

    await this.redis.setex(cacheKey, expirationTime, userData);
  }

  /**
   * Gets a user from the cache
   * @param key - Cache key (typically user ID)
   * @returns Promise resolving to the User entity if found, null otherwise
   */
  async get(key: string): Promise<User | null> {
    const cacheKey = this.buildCacheKey(key);
    const userData = await this.redis.get(cacheKey);

    if (!userData) {
      return null;
    }

    try {
      return UserRedisEntity.fromRedis(userData);
    } catch (error) {
      // If deserialization fails, remove the corrupted cache entry
      await this.delete(key);
      return null;
    }
  }

  /**
   * Deletes a user from the cache
   * @param key - Cache key (typically user ID)
   * @returns Promise resolving when the operation is complete
   */
  async delete(key: string): Promise<void> {
    const cacheKey = this.buildCacheKey(key);
    await this.redis.del(cacheKey);
  }

  /**
   * Checks if a user exists in the cache
   * @param key - Cache key (typically user ID)
   * @returns Promise resolving to true if exists, false otherwise
   */
  async exists(key: string): Promise<boolean> {
    const cacheKey = this.buildCacheKey(key);
    const result = await this.redis.exists(cacheKey);
    return result === 1;
  }

  /**
   * Clears all user cache entries
   * @returns Promise resolving when the operation is complete
   */
  async clear(): Promise<void> {
    const pattern = `${this.USER_CACHE_PREFIX}*`;
    const keys = await this.redis.keys(pattern);

    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  /**
   * Sets multiple users in the cache
   * @param entries - Array of key-value pairs to cache
   * @param ttl - Time to live in seconds (optional, defaults to 1 hour)
   * @returns Promise resolving when the operation is complete
   */
  async setMany(
    entries: Array<{ key: string; user: User }>,
    ttl?: number,
  ): Promise<void> {
    if (entries.length === 0) return;

    const pipeline = this.redis.pipeline();
    const expirationTime = ttl || this.DEFAULT_TTL;

    entries.forEach(({ key, user }) => {
      const cacheKey = this.buildCacheKey(key);
      const userData = UserRedisEntity.toRedis(user);
      pipeline.setex(cacheKey, expirationTime, userData);
    });

    await pipeline.exec();
  }

  /**
   * Gets multiple users from the cache
   * @param keys - Array of cache keys
   * @returns Promise resolving to a Map of found users
   */
  async getMany(keys: string[]): Promise<Map<string, User>> {
    if (keys.length === 0) return new Map();

    const cacheKeys = keys.map((key) => this.buildCacheKey(key));
    const results = await this.redis.mget(...cacheKeys);
    const userMap = new Map<string, User>();

    for (let i = 0; i < keys.length; i++) {
      const userData = results[i];
      if (userData) {
        try {
          const user = UserRedisEntity.fromRedis(userData);
          userMap.set(keys[i], user);
        } catch (error) {
          // If deserialization fails, remove the corrupted cache entry
          await this.delete(keys[i]);
        }
      }
    }

    return userMap;
  }

  /**
   * Deletes multiple users from the cache
   * @param keys - Array of cache keys to delete
   * @returns Promise resolving when the operation is complete
   */
  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    const cacheKeys = keys.map((key) => this.buildCacheKey(key));
    await this.redis.del(...cacheKeys);
  }

  /**
   * Gets all cached user keys matching a pattern
   * @param pattern - Pattern to match (e.g., "user:*")
   * @returns Promise resolving to array of matching keys
   */
  async getKeys(pattern: string): Promise<string[]> {
    const searchPattern = pattern.startsWith(this.USER_CACHE_PREFIX)
      ? pattern
      : `${this.USER_CACHE_PREFIX}${pattern}`;

    return await this.redis.keys(searchPattern);
  }

  /**
   * Sets the TTL for an existing cache entry
   * @param key - Cache key
   * @param ttl - Time to live in seconds
   * @returns Promise resolving when the operation is complete
   */
  async expire(key: string, ttl: number): Promise<void> {
    const cacheKey = this.buildCacheKey(key);
    await this.redis.expire(cacheKey, ttl);
  }

  /**
   * Builds a standardized cache key
   * @param key - The input key
   * @returns Standardized cache key with prefix
   */
  private buildCacheKey(key: string): string {
    return key.startsWith(this.USER_CACHE_PREFIX)
      ? key
      : `${this.USER_CACHE_PREFIX}${key}`;
  }

  /**
   * Gets cache statistics for monitoring
   * @returns Promise resolving to cache statistics
   */
  async getStats(): Promise<{
    totalKeys: number;
    memoryUsage: string;
    hits: number;
    misses: number;
  }> {
    const keys = await this.getKeys('*');
    const info = await this.redis.info('memory');
    const stats = await this.redis.info('stats');

    // Parse memory usage from info string
    const memoryMatch = info.match(/used_memory_human:(.+)/);
    const memoryUsage = memoryMatch ? memoryMatch[1].trim() : 'N/A';

    // Parse hits and misses from stats
    const hitsMatch = stats.match(/keyspace_hits:(\d+)/);
    const missesMatch = stats.match(/keyspace_misses:(\d+)/);
    const hits = hitsMatch ? parseInt(hitsMatch[1]) : 0;
    const misses = missesMatch ? parseInt(missesMatch[1]) : 0;

    return {
      totalKeys: keys.length,
      memoryUsage,
      hits,
      misses,
    };
  }

  /**
   * Performs a health check on the Redis connection
   * @returns Promise resolving to true if healthy, false otherwise
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      return false;
    }
  }
}
