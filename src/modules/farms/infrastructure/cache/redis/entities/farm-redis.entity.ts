import { FarmEntity } from '../../../../domain/entities/farm.entity';
import { FarmsPrimitive } from '../../../../domain/primitives/farm.primitive';

/**
 * FarmRedisEntity
 * Maps between Redis cached data and domain Farms entity
 * Handles serialization/deserialization for Redis storage
 */
export class FarmRedisEntity {
  /**
   * Converts a Redis cached string to a domain entity
   * @param redisData - The Redis cached JSON string
   * @returns Domain entity
   */
  static fromRedis(redisData: string): FarmEntity {
    const primitive: FarmsPrimitive = JSON.parse(redisData);
    return FarmEntity.fromPrimitives(primitive);
  }

  /**
   * Converts a domain entity to a Redis-storable JSON string
   * @param entity - The domain entity
   * @returns JSON string ready for Redis storage
   */
  static toRedis(entity: FarmEntity): string {
    return JSON.stringify(entity.toPrimitives());
  }

  // Add more static helpers as needed (toRedisMany, fromRedisMany, etc.)
}
