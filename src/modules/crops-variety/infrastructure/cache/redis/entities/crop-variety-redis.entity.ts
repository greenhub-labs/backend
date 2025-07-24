import { CropVarietyEntity } from '../../../../domain/entities/crop-variety.entity';
import { CropVarietyFactory } from '../../../../domain/factories/crop-variety.factory';

import { CropVarietyPrimitive } from '../../../../domain/primitives/crop-variety.primitive';

/**
 * CropVarietyRedisEntity
 * Maps between Redis cached data and domain CropVariety entity
 * Handles serialization/deserialization for Redis storage
 */
export class CropVarietyRedisEntity {
  /**
   * Converts a Redis cached string to a domain entity
   * @param redisData - The Redis cached JSON string
   * @returns Domain entity
   */
  static fromRedis(redisData: string): CropVarietyEntity {
    const primitive: CropVarietyPrimitive = JSON.parse(redisData);
    return CropVarietyFactory.fromPrimitives(primitive);
  }

  /**
   * Converts a domain entity to a Redis-storable JSON string
   * @param entity - The domain entity
   * @returns JSON string ready for Redis storage
   */
  static toRedis(entity: CropVarietyEntity): string {
    return JSON.stringify(entity.toPrimitives());
  }

  // Add more static helpers as needed (toRedisMany, fromRedisMany, etc.)
}
