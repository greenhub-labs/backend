import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CropsCacheRepository } from '../../../../application/ports/crops-cache.repository';
import { CropEntity } from '../../../../domain/entities/crop.entity';
import { CropRedisEntity } from '../entities/crop-redis.entity';

/**
 * Redis implementation of the PlotsCacheRepository interface
 * Handles caching operations for Plots entities using Redis
 */
@Injectable()
export class CropsRedisCacheRepository implements CropsCacheRepository {
  private readonly DEFAULT_TTL = 3600; // 1 hour in seconds
  private readonly CACHE_PREFIX = 'crops:';

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async set(key: string, entity: CropEntity, ttl?: number): Promise<void> {
    const cacheKey = this.buildCacheKey(key);
    const data = CropRedisEntity.toRedis(entity);
    const expirationTime = ttl || this.DEFAULT_TTL;
    await this.redis.setex(cacheKey, expirationTime, data);
  }

  async get(key: string): Promise<CropEntity | null> {
    const cacheKey = this.buildCacheKey(key);
    const data = await this.redis.get(cacheKey);
    if (!data) return null;
    try {
      return CropRedisEntity.fromRedis(data);
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
    entries: Array<{ key: string; entity: CropEntity }>,
    ttl?: number,
  ): Promise<void> {
    if (entries.length === 0) return;
    const pipeline = this.redis.pipeline();
    const expirationTime = ttl || this.DEFAULT_TTL;
    entries.forEach(({ key, entity }) => {
      const cacheKey = this.buildCacheKey(key);
      const data = CropRedisEntity.toRedis(entity);
      pipeline.setex(cacheKey, expirationTime, data);
    });
    await pipeline.exec();
  }

  async getMany(keys: string[]): Promise<CropEntity[]> {
    if (keys.length === 0) return [];
    const cacheKeys = keys.map((key) => this.buildCacheKey(key));
    const results = await this.redis.mget(...cacheKeys);
    const entities: CropEntity[] = [];
    for (let i = 0; i < keys.length; i++) {
      const data = results[i];
      if (data) {
        try {
          const entity = CropRedisEntity.fromRedis(data);
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
