import { CropEntity } from 'src/modules/crops/domain/entities/crop.entity';
import { CropRedisEntity } from './crop-redis.entity';

describe('CropRedisEntity', () => {
  it('should serialize and deserialize correctly', () => {
    const entity = { id: 'test', value: 123 } as unknown as CropEntity;
    const serialized = CropRedisEntity.toRedis(entity);
    const deserialized = CropRedisEntity.fromRedis(serialized);
    expect(deserialized).toEqual(entity);
  });
});
