import { FarmEntity } from '../../domain/entities/farm.entity';

/**
 * Cache repository port for Farms aggregate.
 * Defines the contract for caching Farm entities.
 */
export interface FarmsCacheRepository {
  /** Set a Farm entity in cache */
  set(id: string, entity: FarmEntity): Promise<void>;
  /** Get a Farm entity from cache by ID */
  get(id: string): Promise<FarmEntity | null>;
  /** Remove a Farm entity from cache by ID */
  remove(id: string): Promise<void>;
  /** Clear all cache */
  clear(): Promise<void>;
  /** Set multiple Farm entities in cache */
  setMany(
    entries: Array<{ key: string; entity: FarmEntity }>,
    ttl?: number,
  ): Promise<void>;
  /** Get multiple Farm entities from cache by IDs */
  getMany(ids: string[]): Promise<Map<string, FarmEntity>>;
  /** Delete multiple Farm entities from cache by IDs */
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
