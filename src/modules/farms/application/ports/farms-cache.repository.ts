import { User } from "../../../../../example/users/domain/entities/user.entity";

/**
 * Cache repository port for Farms aggregate.
 * Add more methods as needed for your use case.
 */
export interface FarmsCacheRepository {
  /** Set an aggregate in cache */
  set(id: string, entity: any): Promise<void>;
  /** Get an aggregate from cache by ID */
  get(id: string): Promise<any | null>;
  /** Remove an aggregate from cache by ID */
  remove(id: string): Promise<void>;
  /** Clear all cache */
  clear(): Promise<void>;
  /** Set multiple aggregates in cache */
  setMany(entries: Array<{ key: string; entity: any }>, ttl?: number): Promise<void>;
  /** Get multiple aggregates from cache by IDs */
  getMany(ids: string[]): Promise<Map<string, any>>;
  /** Delete multiple aggregates from cache by IDs */
  deleteMany(ids: string[]): Promise<void>;
  /** Get all cached keys matching a pattern */
  getKeys(pattern: string): Promise<string[]>;
  /** Set the TTL for an existing cache entry */
  expire(key: string, ttl: number): Promise<void>;
}

/**
 * Injection token for FarmsCacheRepository
 */
export const FARMS_CACHE_REPOSITORY_TOKEN = 'FarmsCacheRepository'; 