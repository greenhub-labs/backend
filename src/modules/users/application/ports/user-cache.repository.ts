import { User } from '../../domain/entities/user.entity';

/**
 * Token for UserCacheRepository dependency injection
 */
export const USER_CACHE_REPOSITORY_TOKEN = Symbol('UserCacheRepository');

/**
 * UserCacheRepository port for user caching operations
 * Defines the contract for caching User entities following DDD principles
 */
export interface UserCacheRepository {
  /**
   * Sets a user in the cache
   * @param key - Cache key (typically user ID)
   * @param user - User entity to cache
   * @param ttl - Time to live in seconds (optional)
   * @returns Promise resolving when the operation is complete
   */
  set(key: string, user: User, ttl?: number): Promise<void>;

  /**
   * Gets a user from the cache
   * @param key - Cache key (typically user ID)
   * @returns Promise resolving to the User entity if found, null otherwise
   */
  get(key: string): Promise<User | null>;

  /**
   * Deletes a user from the cache
   * @param key - Cache key (typically user ID)
   * @returns Promise resolving when the operation is complete
   */
  delete(key: string): Promise<void>;

  /**
   * Checks if a user exists in the cache
   * @param key - Cache key (typically user ID)
   * @returns Promise resolving to true if exists, false otherwise
   */
  exists(key: string): Promise<boolean>;

  /**
   * Clears all user cache entries
   * @returns Promise resolving when the operation is complete
   */
  clear(): Promise<void>;

  /**
   * Sets multiple users in the cache
   * @param entries - Array of key-value pairs to cache
   * @param ttl - Time to live in seconds (optional)
   * @returns Promise resolving when the operation is complete
   */
  setMany(
    entries: Array<{ key: string; user: User }>,
    ttl?: number,
  ): Promise<void>;

  /**
   * Gets multiple users from the cache
   * @param keys - Array of cache keys
   * @returns Promise resolving to a Map of found users
   */
  getMany(keys: string[]): Promise<Map<string, User>>;

  /**
   * Deletes multiple users from the cache
   * @param keys - Array of cache keys to delete
   * @returns Promise resolving when the operation is complete
   */
  deleteMany(keys: string[]): Promise<void>;

  /**
   * Gets all cached user keys matching a pattern
   * @param pattern - Pattern to match (e.g., "user:*")
   * @returns Promise resolving to array of matching keys
   */
  getKeys(pattern: string): Promise<string[]>;

  /**
   * Sets the TTL for an existing cache entry
   * @param key - Cache key
   * @param ttl - Time to live in seconds
   * @returns Promise resolving when the operation is complete
   */
  expire(key: string, ttl: number): Promise<void>;
}
