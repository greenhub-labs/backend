import { FarmRedisEntity } from './plot-redis.entity';
import { FarmEntity } from 'src/modules/farms/domain/entities/farm.entity';

describe('FarmRedisEntity', () => {
  it('should serialize and deserialize correctly', () => {
    const entity = { id: 'test', value: 123 } as unknown as FarmEntity;
    const serialized = FarmRedisEntity.toRedis(entity);
    const deserialized = FarmRedisEntity.fromRedis(serialized);
    expect(deserialized).toEqual(entity);
  });
});
