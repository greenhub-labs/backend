import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import { CropVarietyRedisEntity } from './crop-variety-redis.entity';

describe('CropVarietyRedisEntity', () => {
  it('should serialize and deserialize correctly', () => {
    const mockEntity = {
      id: { value: 'variety-123' },
      name: 'Test Variety',
      scientificName: 'Test Scientific Name',
      type: { value: 'VEGETABLE' },
      description: 'Test description',
      averageYield: 2.5,
      daysToMaturity: 75,
      plantingDepth: 1.5,
      spacingBetween: 60,
      waterRequirements: 'Regular watering',
      sunRequirements: 'Full sun',
      minIdealTemperature: 18,
      maxIdealTemperature: 30,
      minIdealPh: 6,
      maxIdealPh: 7,
      compatibleWith: ['Basil', 'Marigold'],
      incompatibleWith: ['Potato', 'Corn'],
      plantingSeasons: [{ value: 'SPRING' }, { value: 'SUMMER' }],
      harvestSeasons: [{ value: 'SUMMER' }, { value: 'AUTUMN' }],
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      deletedAt: undefined,
      toPrimitives: () => ({
        id: 'variety-123',
        name: 'Test Variety',
        scientificName: 'Test Scientific Name',
        type: 'VEGETABLE',
        description: 'Test description',
        averageYield: 2.5,
        daysToMaturity: 75,
        plantingDepth: 1.5,
        spacingBetween: 60,
        waterRequirements: 'Regular watering',
        sunRequirements: 'Full sun',
        minIdealTemperature: 18,
        maxIdealTemperature: 30,
        minIdealPh: 6,
        maxIdealPh: 7,
        compatibleWith: ['Basil', 'Marigold'],
        incompatibleWith: ['Potato', 'Corn'],
        plantingSeasons: ['SPRING', 'SUMMER'],
        harvestSeasons: ['SUMMER', 'AUTUMN'],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        deletedAt: undefined,
      }),
    } as any as CropVarietyEntity;

    const serialized = CropVarietyRedisEntity.toRedis(mockEntity);
    const deserialized = CropVarietyRedisEntity.fromRedis(serialized);

    expect(serialized).toBeDefined();
    expect(deserialized).toBeDefined();
    expect(deserialized.id.value).toBe('variety-123');
    expect(deserialized.name).toBe('Test Variety');
    expect(deserialized.type.value).toBe('VEGETABLE');
  });
});
