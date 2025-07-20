import { PlotEntity } from '../../../../domain/entities/plot.entity';
import { PlotsPrimitive } from '../../../../domain/primitives/plot.primitive';

/**
 * PlotRedisEntity
 * Maps between Redis cached data and domain Plots entity
 * Handles serialization/deserialization for Redis storage
 */
export class PlotRedisEntity {
  /**
   * Converts a Redis cached string to a domain entity
   * @param redisData - The Redis cached JSON string
   * @returns Domain entity
   */
  static fromRedis(redisData: string): PlotEntity {
    const primitive: PlotsPrimitive = JSON.parse(redisData);
    return PlotEntity.fromPrimitives(primitive);
  }

  /**
   * Converts a domain entity to a Redis-storable JSON string
   * @param entity - The domain entity
   * @returns JSON string ready for Redis storage
   */
  static toRedis(entity: PlotEntity): string {
    return JSON.stringify(entity.toPrimitives());
  }

  // Add more static helpers as needed (toRedisMany, fromRedisMany, etc.)
}
