import { CropEntity } from '../../domain/entities/crop.entity';

/**
 * Cache repository port for Crops aggregate.
 * Defines the contract for caching Crop entities.
 */
export interface CropsCacheRepository {
  /** Set a Crop entity in cache */
  set(id: string, entity: CropEntity): Promise<void>;
  /** Get a Crop entity from cache by ID */
  get(id: string): Promise<CropEntity | null>;
  /** Remove a Crop entity from cache by ID */
  remove(id: string): Promise<void>;
  /** Clear all cache */
  clear(): Promise<void>;
  /** Set multiple Crop entities in cache */
  setMany(
    entries: Array<{ key: string; entity: CropEntity }>,
    ttl?: number,
  ): Promise<void>;
  /** Get multiple Crop entities from cache by IDs */
  getMany(ids: string[]): Promise<CropEntity[]>;
  /** Delete multiple Crop entities from cache by IDs */
  deleteMany(ids: string[]): Promise<void>;
  /** Get all cached keys matching a pattern */
  getKeys(pattern: string): Promise<string[]>;
  /** Set the TTL for an existing cache entry */
  expire(key: string, ttl: number): Promise<void>;
}

/**
 * Injection token for CropsCacheRepository
 */
export const CROPS_CACHE_REPOSITORY_TOKEN = 'CropsCacheRepository';
