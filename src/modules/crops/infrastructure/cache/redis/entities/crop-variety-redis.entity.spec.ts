import { CropVarietyEntity } from 'src/modules/crops/domain/entities/crop-variety.entity';
import { CropVarietyRedisEntity } from './crop-variety-redis.entity';

describe('CropVarietyRedisEntity', () => {
  it('should serialize and deserialize correctly', () => {
    const entity = { id: 'test', value: 123 } as unknown as CropVarietyEntity;
    const serialized = CropVarietyRedisEntity.toRedis(entity);
    const deserialized = CropVarietyRedisEntity.fromRedis(serialized);
    expect(deserialized).toEqual(entity);
  });
});
