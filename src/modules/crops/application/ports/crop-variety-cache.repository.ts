import { CropVarietyEntity } from '../../domain/entities/crop-variety.entity';

/**
 * Port for the CropVariety cache repository (Dependency Inversion)
 * Defines the contract for cache operations on CropVariety entities.
 */
export interface CropVarietyCacheRepository {
  /** Set a Crop entity in cache */
  set(id: string, entity: CropVarietyEntity): Promise<void>;
  /** Get a Crop entity from cache by ID */
  get(id: string): Promise<CropVarietyEntity | null>;
  /** Remove a Crop entity from cache by ID */
  remove(id: string): Promise<void>;
  /** Clear all cache */
  clear(): Promise<void>;
  /** Set multiple Crop entities in cache */
  setMany(
    entries: Array<{ key: string; entity: CropVarietyEntity }>,
    ttl?: number,
  ): Promise<void>;
  /** Get multiple Crop entities from cache by IDs */
  getMany(ids: string[]): Promise<CropVarietyEntity[]>;
  /** Delete multiple Crop entities from cache by IDs */
  deleteMany(ids: string[]): Promise<void>;
  /** Get all cached keys matching a pattern */
  getKeys(pattern: string): Promise<string[]>;
  /** Set the TTL for an existing cache entry */
  expire(key: string, ttl: number): Promise<void>;
}

/**
 * Injection token for CropVarietyCacheRepository
 */
export const CROP_VARIETY_CACHE_REPOSITORY_TOKEN = 'CropVarietyCacheRepository';
