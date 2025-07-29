import { CropEntity } from '../../../../domain/entities/crop.entity';
import { CropRedisEntity } from './crop-redis.entity';

describe('CropRedisEntity', () => {
  it('should serialize and deserialize correctly', () => {
    const mockEntity = {
      id: { value: '550e8400-e29b-41d4-a716-446655440000' },
      plotId: 'plot-123',
      varietyId: 'variety-123',
      plantingDate: { toISOString: () => '2023-01-01T00:00:00.000Z' },
      expectedHarvest: { toISOString: () => '2023-06-01T00:00:00.000Z' },
      actualHarvest: { toISOString: () => '2023-06-01T00:00:00.000Z' },
      quantity: 100,
      status: { value: 'PLANTED' },
      plantingMethod: { value: 'DIRECT_SEED' },
      notes: 'Test notes',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      deletedAt: undefined,
      toPrimitives: () => ({
        id: '550e8400-e29b-41d4-a716-446655440000',
        plotId: 'plot-123',
        varietyId: 'variety-123',
        plantingDate: '2023-01-01T00:00:00.000Z',
        expectedHarvest: '2023-06-01T00:00:00.000Z',
        actualHarvest: '2023-06-01T00:00:00.000Z',
        quantity: 100,
        status: 'PLANTED',
        plantingMethod: 'DIRECT_SEED',
        notes: 'Test notes',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        deletedAt: undefined,
      }),
    } as any as CropEntity;

    const serialized = CropRedisEntity.toRedis(mockEntity);
    const deserialized = CropRedisEntity.fromRedis(serialized);

    expect(serialized).toBeDefined();
    expect(deserialized).toBeDefined();
    expect(deserialized.id.value).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(deserialized.plotId).toBe('plot-123');
    expect(deserialized.varietyId).toBe('variety-123');
  });
});
