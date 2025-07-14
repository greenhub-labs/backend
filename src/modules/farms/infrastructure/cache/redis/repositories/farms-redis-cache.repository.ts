import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { FarmsCacheRepository } from '../../../../application/ports/farms-cache.repository';
import { Farms } from '../../../../domain/entities/farms.entity';
import { FarmsRedisEntity } from '../entities/farms-redis.entity';

/**
 * Redis implementation of the FarmsCacheRepository interface
 * Handles caching operations for Farms entities using Redis
 */
@Injectable()
export class FarmsRedisCacheRepository implements FarmsCacheRepository {
  private readonly DEFAULT_TTL = 3600; // 1 hour in seconds
  private readonly CACHE_PREFIX = 'farms:';

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async set(key: string, entity: Farms, ttl?: number): Promise<void> {
    const cacheKey = this.buildCacheKey(key);
    const data = FarmsRedisEntity.toRedis(entity);
    const expirationTime = ttl || this.DEFAULT_TTL;
    await this.redis.setex(cacheKey, expirationTime, data);
  }

  async get(key: string): Promise<Farms | null> {
    const cacheKey = this.buildCacheKey(key);
    const data = await this.redis.get(cacheKey);
    if (!data) return null;
    try {
      return FarmsRedisEntity.fromRedis(data);
    } catch {
      await this.delete(key);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    const cacheKey = this.buildCacheKey(key);
    await this.redis.del(cacheKey);
  }

  // Add more methods (setMany, getMany, etc.) as needed, following the example

  private buildCacheKey(key: string): string {
    return key.startsWith(this.CACHE_PREFIX) ? key : `${this.CACHE_PREFIX}${key}`;
  }
} 