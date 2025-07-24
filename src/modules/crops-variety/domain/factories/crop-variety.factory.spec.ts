import { SEASON } from 'src/shared/domain/constants/season.constant';
import { CropVarietyEntity } from '../entities/crop-variety.entity';
import { CropVarietyIdValueObject } from '../value-objects/crop-variety-id/crop-variety-id.value-object';
import { CropVarietyTypeValueObject } from '../value-objects/crop-variety-type/crop-variety-type.value-object';
import { CropVarietyFactory } from './crop-variety.factory';

const uuid = '123e4567-e89b-12d3-a456-426614174000';
const now = new Date();

describe('CropVarietyFactory', () => {
  let factory: CropVarietyFactory;

  beforeEach(() => {
    factory = new CropVarietyFactory();
  });

  it('should create a CropVarietyEntity with minimal data', () => {
    const entity = factory.create({
      name: 'Test Variety',
      type: 'VEGETABLE',
      compatibleWith: [],
      incompatibleWith: [],
      plantingSeasons: [],
      harvestSeasons: [],
    });

    expect(entity).toBeInstanceOf(CropVarietyEntity);
    expect(entity.id).toBeInstanceOf(CropVarietyIdValueObject);
    expect(entity.name).toBe('Test Variety');
    expect(entity.type).toBeInstanceOf(CropVarietyTypeValueObject);
    expect(entity.type.value).toBe('VEGETABLE');
    expect(entity.scientificName).toBeUndefined();
    expect(entity.description).toBeUndefined();
    expect(entity.averageYield).toBeUndefined();
    expect(entity.daysToMaturity).toBeUndefined();
    expect(entity.plantingDepth).toBeUndefined();
    expect(entity.spacingBetween).toBeUndefined();
    expect(entity.waterRequirements).toBeUndefined();
    expect(entity.sunRequirements).toBeUndefined();
    expect(entity.minIdealTemperature).toBeUndefined();
    expect(entity.maxIdealTemperature).toBeUndefined();
    expect(entity.minIdealPh).toBeUndefined();
    expect(entity.maxIdealPh).toBeUndefined();
    expect(entity.compatibleWith).toEqual([]);
    expect(entity.incompatibleWith).toEqual([]);
    expect(entity.plantingSeasons).toEqual([]);
    expect(entity.harvestSeasons).toEqual([]);
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
    expect(entity.deletedAt).toBeUndefined();
  });

  it('should create a CropVarietyEntity with all fields', () => {
    const entity = factory.create({
      name: 'Tomato Roma',
      scientificName: 'Solanum lycopersicum',
      type: 'VEGETABLE',
      description: 'A popular variety of tomato',
      averageYield: 2.5,
      daysToMaturity: 75,
      plantingDepth: 1.5,
      spacingBetween: 60,
      waterRequirements: 'Regular watering needed',
      sunRequirements: 'Full sun',
      minIdealTemperature: 18,
      maxIdealTemperature: 30,
      minIdealPh: 6.0,
      maxIdealPh: 7.0,
      compatibleWith: ['Basil', 'Marigold'],
      incompatibleWith: ['Potato', 'Corn'],
      plantingSeasons: [SEASON.SPRING, SEASON.SUMMER],
      harvestSeasons: [SEASON.SUMMER, SEASON.AUTUMN],
    });

    expect(entity).toBeInstanceOf(CropVarietyEntity);
    expect(entity.id).toBeInstanceOf(CropVarietyIdValueObject);
    expect(entity.name).toBe('Tomato Roma');
    expect(entity.scientificName).toBe('Solanum lycopersicum');
    expect(entity.type.value).toBe('VEGETABLE');
    expect(entity.description).toBe('A popular variety of tomato');
    expect(entity.averageYield).toBe(2.5);
    expect(entity.daysToMaturity).toBe(75);
    expect(entity.plantingDepth).toBe(1.5);
    expect(entity.spacingBetween).toBe(60);
    expect(entity.waterRequirements).toBe('Regular watering needed');
    expect(entity.sunRequirements).toBe('Full sun');
    expect(entity.minIdealTemperature).toBe(18);
    expect(entity.maxIdealTemperature).toBe(30);
    expect(entity.minIdealPh).toBe(6.0);
    expect(entity.maxIdealPh).toBe(7.0);
    expect(entity.compatibleWith).toEqual(['Basil', 'Marigold']);
    expect(entity.incompatibleWith).toEqual(['Potato', 'Corn']);
    expect(entity.plantingSeasons).toHaveLength(2);
    expect(entity.harvestSeasons).toHaveLength(2);
    expect(entity.plantingSeasons[0].value).toBe(SEASON.SPRING);
    expect(entity.plantingSeasons[1].value).toBe(SEASON.SUMMER);
    expect(entity.harvestSeasons[0].value).toBe(SEASON.SUMMER);
    expect(entity.harvestSeasons[1].value).toBe(SEASON.AUTUMN);
  });

  it('should reconstruct a CropVarietyEntity from primitives', () => {
    const entity = CropVarietyFactory.fromPrimitives({
      id: uuid,
      name: 'Tomato Roma',
      scientificName: 'Solanum lycopersicum',
      type: 'VEGETABLE',
      description: 'A popular variety of tomato',
      averageYield: 2.5,
      daysToMaturity: 75,
      plantingDepth: 1.5,
      spacingBetween: 60,
      waterRequirements: 'Regular watering needed',
      sunRequirements: 'Full sun',
      minIdealTemperature: 18,
      maxIdealTemperature: 30,
      minIdealPh: 6.0,
      maxIdealPh: 7.0,
      compatibleWith: ['Basil', 'Marigold'],
      incompatibleWith: ['Potato', 'Corn'],
      plantingSeasons: [SEASON.SPRING, SEASON.SUMMER],
      harvestSeasons: [SEASON.SUMMER, SEASON.AUTUMN],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: undefined,
    });

    expect(entity).toBeInstanceOf(CropVarietyEntity);
    expect(entity.id.value).toBe(uuid);
    expect(entity.name).toBe('Tomato Roma');
    expect(entity.scientificName).toBe('Solanum lycopersicum');
    expect(entity.type.value).toBe('VEGETABLE');
    expect(entity.description).toBe('A popular variety of tomato');
    expect(entity.averageYield).toBe(2.5);
    expect(entity.daysToMaturity).toBe(75);
    expect(entity.plantingDepth).toBe(1.5);
    expect(entity.spacingBetween).toBe(60);
    expect(entity.waterRequirements).toBe('Regular watering needed');
    expect(entity.sunRequirements).toBe('Full sun');
    expect(entity.minIdealTemperature).toBe(18);
    expect(entity.maxIdealTemperature).toBe(30);
    expect(entity.minIdealPh).toBe(6.0);
    expect(entity.maxIdealPh).toBe(7.0);
    expect(entity.compatibleWith).toEqual(['Basil', 'Marigold']);
    expect(entity.incompatibleWith).toEqual(['Potato', 'Corn']);
    expect(entity.plantingSeasons).toHaveLength(2);
    expect(entity.harvestSeasons).toHaveLength(2);
    expect(entity.createdAt.toISOString()).toBe(now.toISOString());
    expect(entity.updatedAt.toISOString()).toBe(now.toISOString());
    expect(entity.deletedAt).toBeUndefined();
  });

  it('should reconstruct a CropVarietyEntity with deletedAt', () => {
    const deletedAt = new Date('2024-12-31');
    const entity = CropVarietyFactory.fromPrimitives({
      id: uuid,
      name: 'Deleted Variety',
      type: 'VEGETABLE',
      compatibleWith: [],
      incompatibleWith: [],
      plantingSeasons: [],
      harvestSeasons: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: deletedAt.toISOString(),
    });

    expect(entity).toBeInstanceOf(CropVarietyEntity);
    expect(entity.id.value).toBe(uuid);
    expect(entity.name).toBe('Deleted Variety');
    expect(entity.deletedAt).toEqual(deletedAt);
  });

  it('should handle optional fields correctly in fromPrimitives', () => {
    const entity = CropVarietyFactory.fromPrimitives({
      id: uuid,
      name: 'Minimal Variety',
      type: 'VEGETABLE',
      compatibleWith: [],
      incompatibleWith: [],
      plantingSeasons: [],
      harvestSeasons: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: undefined,
    });

    expect(entity.scientificName).toBeUndefined();
    expect(entity.description).toBeUndefined();
    expect(entity.averageYield).toBeUndefined();
    expect(entity.daysToMaturity).toBeUndefined();
    expect(entity.plantingDepth).toBeUndefined();
    expect(entity.spacingBetween).toBeUndefined();
    expect(entity.waterRequirements).toBeUndefined();
    expect(entity.sunRequirements).toBeUndefined();
    expect(entity.minIdealTemperature).toBeUndefined();
    expect(entity.maxIdealTemperature).toBeUndefined();
    expect(entity.minIdealPh).toBeUndefined();
    expect(entity.maxIdealPh).toBeUndefined();
  });

  it('should create different entities with different IDs', () => {
    const entity1 = factory.create({
      name: 'Variety 1',
      type: 'VEGETABLE',
      compatibleWith: [],
      incompatibleWith: [],
      plantingSeasons: [],
      harvestSeasons: [],
    });

    const entity2 = factory.create({
      name: 'Variety 2',
      type: 'FRUIT',
      compatibleWith: [],
      incompatibleWith: [],
      plantingSeasons: [],
      harvestSeasons: [],
    });

    expect(entity1.id.value).not.toBe(entity2.id.value);
    expect(entity1.name).toBe('Variety 1');
    expect(entity2.name).toBe('Variety 2');
  });

  it('should handle different crop types correctly', () => {
    const types = ['VEGETABLE', 'FRUIT', 'HERB', 'GRAIN', 'LEGUME'];

    types.forEach((type) => {
      const entity = factory.create({
        name: `Test ${type}`,
        type,
        compatibleWith: [],
        incompatibleWith: [],
        plantingSeasons: [],
        harvestSeasons: [],
      });

      expect(entity.type.value).toBe(type);
    });
  });

  it('should handle empty arrays for compatible and incompatible plants', () => {
    const entity = factory.create({
      name: 'Test Variety',
      type: 'VEGETABLE',
      compatibleWith: [],
      incompatibleWith: [],
      plantingSeasons: [],
      harvestSeasons: [],
    });

    expect(entity.compatibleWith).toEqual([]);
    expect(entity.incompatibleWith).toEqual([]);
  });

  it('should handle single season arrays', () => {
    const entity = factory.create({
      name: 'Test Variety',
      type: 'VEGETABLE',
      compatibleWith: [],
      incompatibleWith: [],
      plantingSeasons: [SEASON.SPRING],
      harvestSeasons: [SEASON.SUMMER],
    });

    expect(entity.plantingSeasons).toHaveLength(1);
    expect(entity.plantingSeasons[0].value).toBe(SEASON.SPRING);
    expect(entity.harvestSeasons).toHaveLength(1);
    expect(entity.harvestSeasons[0].value).toBe(SEASON.SUMMER);
  });
});
