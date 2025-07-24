import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CropVarietyCacheRepository } from 'src/modules/crops-variety/application/ports/crop-variety-cache.repository';
import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import { CropVarietyRedisEntity } from '../entities/crop-variety-redis.entity';

/**
 * Redis implementation of the PlotsCacheRepository interface
 * Handles caching operations for Plots entities using Redis
 */
@Injectable()
export class CropsVarietyRedisCacheRepository
  implements CropVarietyCacheRepository
{
  private readonly DEFAULT_TTL = 3600; // 1 hour in seconds
  private readonly CACHE_PREFIX = 'crops-varieties:';

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async set(
    key: string,
    entity: CropVarietyEntity,
    ttl?: number,
  ): Promise<void> {
    const cacheKey = this.buildCacheKey(key);
    const data = CropVarietyRedisEntity.toRedis(entity);
    const expirationTime = ttl || this.DEFAULT_TTL;
    await this.redis.setex(cacheKey, expirationTime, data);
  }

  async get(key: string): Promise<CropVarietyEntity | null> {
    const cacheKey = this.buildCacheKey(key);
    const data = await this.redis.get(cacheKey);
    if (!data) return null;
    try {
      return CropVarietyRedisEntity.fromRedis(data);
    } catch {
      await this.delete(key);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    const cacheKey = this.buildCacheKey(key);
    await this.redis.del(cacheKey);
  }

  async setMany(
    entries: Array<{ key: string; entity: CropVarietyEntity }>,
    ttl?: number,
  ): Promise<void> {
    if (entries.length === 0) return;
    const pipeline = this.redis.pipeline();
    const expirationTime = ttl || this.DEFAULT_TTL;
    entries.forEach(({ key, entity }) => {
      const cacheKey = this.buildCacheKey(key);
      const data = CropVarietyRedisEntity.toRedis(entity);
      pipeline.setex(cacheKey, expirationTime, data);
    });
    await pipeline.exec();
  }

  async getMany(keys: string[]): Promise<CropVarietyEntity[]> {
    if (keys.length === 0) return [];
    const cacheKeys = keys.map((key) => this.buildCacheKey(key));
    const results = await this.redis.mget(...cacheKeys);
    const entities: CropVarietyEntity[] = [];
    for (let i = 0; i < keys.length; i++) {
      const data = results[i];
      if (data) {
        try {
          const entity = CropVarietyRedisEntity.fromRedis(data);
          entities.push(entity);
        } catch {
          await this.delete(keys[i]);
        }
      }
    }
    return entities;
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    const cacheKeys = keys.map((key) => this.buildCacheKey(key));
    await this.redis.del(...cacheKeys);
  }

  async getKeys(pattern: string): Promise<string[]> {
    const searchPattern = pattern.startsWith(this.CACHE_PREFIX)
      ? pattern
      : `${this.CACHE_PREFIX}${pattern}`;
    return await this.redis.keys(searchPattern);
  }

  async expire(key: string, ttl: number): Promise<void> {
    const cacheKey = this.buildCacheKey(key);
    await this.redis.expire(cacheKey, ttl);
  }

  async clear(): Promise<void> {
    const pattern = `${this.CACHE_PREFIX}*`;
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  async remove(key: string): Promise<void> {
    return this.delete(key);
  }

  private buildCacheKey(key: string): string {
    return key.startsWith(this.CACHE_PREFIX)
      ? key
      : `${this.CACHE_PREFIX}${key}`;
  }
}
