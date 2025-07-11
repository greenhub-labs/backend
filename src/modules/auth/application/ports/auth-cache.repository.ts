import { Auth } from '../../domain/entities/auth.entity';

/**
 * Token for AuthCacheRepository dependency injection
 */
export const AUTH_CACHE_REPOSITORY_TOKEN = Symbol('AuthCacheRepository');

/**
 * AuthCacheRepository port for authentication caching operations
 * Defines the contract for caching Auth entities following DDD principles
 */
export interface AuthCacheRepository {
  /**
   * Sets an auth record in the cache by user ID
   * @param userId - User ID (primary cache key)
   * @param auth - Auth entity to cache
   * @param ttl - Time to live in seconds (optional)
   * @returns Promise resolving when the operation is complete
   */
  setByUserId(userId: string, auth: Auth, ttl?: number): Promise<void>;

  /**
   * Gets an auth record from the cache by user ID
   * @param userId - User ID
   * @returns Promise resolving to the Auth entity if found, null otherwise
   */
  getByUserId(userId: string): Promise<Auth | null>;

  /**
   * Sets an auth record in the cache by email
   * @param email - Email address (secondary cache key)
   * @param auth - Auth entity to cache
   * @param ttl - Time to live in seconds (optional)
   * @returns Promise resolving when the operation is complete
   */
  setByEmail(email: string, auth: Auth, ttl?: number): Promise<void>;

  /**
   * Gets an auth record from the cache by email
   * @param email - Email address
   * @returns Promise resolving to the Auth entity if found, null otherwise
   */
  getByEmail(email: string): Promise<Auth | null>;

  /**
   * Deletes an auth record from the cache by user ID
   * @param userId - User ID
   * @returns Promise resolving when the operation is complete
   */
  deleteByUserId(userId: string): Promise<void>;

  /**
   * Deletes an auth record from the cache by email
   * @param email - Email address
   * @returns Promise resolving when the operation is complete
   */
  deleteByEmail(email: string): Promise<void>;

  /**
   * Deletes all cache entries for a specific auth record (by userId and email)
   * @param userId - User ID
   * @param email - Email address
   * @returns Promise resolving when the operation is complete
   */
  deleteAuth(userId: string, email: string): Promise<void>;

  /**
   * Checks if an auth record exists in cache by user ID
   * @param userId - User ID
   * @returns Promise resolving to true if exists, false otherwise
   */
  existsByUserId(userId: string): Promise<boolean>;

  /**
   * Checks if an auth record exists in cache by email
   * @param email - Email address
   * @returns Promise resolving to true if exists, false otherwise
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Clears all auth cache entries
   * @returns Promise resolving when the operation is complete
   */
  clear(): Promise<void>;

  /**
   * Sets session information in cache
   * @param sessionId - Session identifier
   * @param sessionData - Session data to cache
   * @param ttl - Time to live in seconds (optional)
   * @returns Promise resolving when the operation is complete
   */
  setSession(sessionId: string, sessionData: any, ttl?: number): Promise<void>;

  /**
   * Gets session information from cache
   * @param sessionId - Session identifier
   * @returns Promise resolving to session data if found, null otherwise
   */
  getSession(sessionId: string): Promise<any | null>;

  /**
   * Deletes a session from cache
   * @param sessionId - Session identifier
   * @returns Promise resolving when the operation is complete
   */
  deleteSession(sessionId: string): Promise<void>;

  /**
   * Gets all cached auth keys matching a pattern
   * @param pattern - Pattern to match (e.g., "auth:user:*")
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

  /**
   * Cache an auth entity in both user and email indices
   * @param auth - Auth entity to cache
   * @param ttl - Time to live in seconds (optional)
   * @returns Promise resolving when the operation is complete
   */
  cacheAuth(auth: Auth, ttl?: number): Promise<void>;

  /**
   * Update an auth entity in cache (both indices)
   * @param auth - Updated auth entity
   * @param ttl - Time to live in seconds (optional)
   * @returns Promise resolving when the operation is complete
   */
  updateAuth(auth: Auth, ttl?: number): Promise<void>;
}
