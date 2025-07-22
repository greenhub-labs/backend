import { PlotEntity } from '../../../../domain/entities/plot.entity';
import { PlotRedisEntity } from './plot-redis.entity';

describe('PlotRedisEntity', () => {
  it('should serialize and deserialize correctly', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const entity = {
      id: { value: uuid },
      toPrimitives: () => ({
        id: uuid,
        name: 'Test Plot',
        farmId: 'farm-1',
        status: 'ACTIVE',
        soilType: 'SANDY',
        soilPh: 7,
        description: 'desc',
        width: 10,
        length: 20,
        height: 1,
        unitMeasurement: 'METERS',
        area: 200,
        perimeter: 60,
        volume: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    } as unknown as PlotEntity;
    const serialized = PlotRedisEntity.toRedis(entity);
    const deserialized = PlotRedisEntity.fromRedis(serialized);
    expect(deserialized.id.value).toEqual(entity.id.value);
  });
});
