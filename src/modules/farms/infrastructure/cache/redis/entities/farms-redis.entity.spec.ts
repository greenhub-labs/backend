import { FarmsRedisEntity } from './farms-redis.entity';

describe('FarmsRedisEntity', () => {
  it('should serialize and deserialize correctly', () => {
    const entity = { id: 'test', value: 123 };
    const serialized = FarmsRedisEntity.toRedis(entity);
    const deserialized = FarmsRedisEntity.fromRedis(serialized);
    expect(deserialized).toEqual(entity);
  });
}); 