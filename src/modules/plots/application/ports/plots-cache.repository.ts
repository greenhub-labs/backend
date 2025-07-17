import { PlotEntity } from '../../domain/entities/plot.entity';

/**
 * Cache repository port for Plots aggregate.
 * Defines the contract for caching Plot entities.
 */
export interface PlotsCacheRepository {
  /** Set a Plot entity in cache */
  set(id: string, entity: PlotEntity): Promise<void>;
  /** Get a Plot entity from cache by ID */
  get(id: string): Promise<PlotEntity | null>;
  /** Remove a Plot entity from cache by ID */
  remove(id: string): Promise<void>;
  /** Clear all cache */
  clear(): Promise<void>;
  /** Set multiple Plot entities in cache */
  setMany(
    entries: Array<{ key: string; entity: PlotEntity }>,
    ttl?: number,
  ): Promise<void>;
  /** Get multiple Plot entities from cache by IDs */
  getMany(ids: string[]): Promise<Map<string, PlotEntity>>;
  /** Delete multiple Plot entities from cache by IDs */
  deleteMany(ids: string[]): Promise<void>;
  /** Get all cached keys matching a pattern */
  getKeys(pattern: string): Promise<string[]>;
  /** Set the TTL for an existing cache entry */
  expire(key: string, ttl: number): Promise<void>;
}

/**
 * Injection token for PlotsCacheRepository
 */
export const PLOTS_CACHE_REPOSITORY_TOKEN = 'PlotsCacheRepository';
