import { CROP_PLANTING_METHODS } from '../constants/crop-planting-methods.constant';
import { CROP_STATUS } from '../constants/crop-status.constant';
import { CropEntity } from '../entities/crop.entity';
import { CropIdValueObject } from '../value-objects/crop-id/crop-id.value-object';
import { CropPlantingMethodValueObject } from '../value-objects/crop-planting-method/crop-planting-method.value-object';
import { CropStatusValueObject } from '../value-objects/crop-status/crop-status.value-object';
import { CropFactory } from './crop.factory';

const uuid = '123e4567-e89b-12d3-a456-426614174000';
const now = new Date();

describe('CropsFactory', () => {
  let factory: CropFactory;

  beforeEach(() => {
    factory = new CropFactory();
  });

  it('should create a CropEntity with minimal data', () => {
    const entity = factory.create({
      plotId: 'Test Plot',
      varietyId: 'Test Variety',
      plantingDate: new Date(),
      expectedHarvest: new Date(),
      actualHarvest: new Date(),
      quantity: 100,
      status: CROP_STATUS.PLANTED,
      plantingMethod: CROP_PLANTING_METHODS.DIRECT_SEED,
      notes: 'Test Notes',
    });
    expect(entity).toBeInstanceOf(CropEntity);
    expect(entity.id).toBeInstanceOf(CropIdValueObject);
    expect(entity.plotId).toBe('Test Plot');
    expect(entity.varietyId).toBe('Test Variety');
    expect(entity.plantingDate).toBeInstanceOf(Date);
    expect(entity.expectedHarvest).toBeInstanceOf(Date);
    expect(entity.actualHarvest).toBeInstanceOf(Date);
    expect(entity.quantity).toBe(100);
    expect(entity.status).toBeInstanceOf(CropStatusValueObject);
    expect(entity.plantingMethod).toBeInstanceOf(CropPlantingMethodValueObject);
    expect(entity.notes).toBe('Test Notes');
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
    expect(entity.deletedAt).toBeUndefined();
  });

  it('should create a CropEntity with all fields', () => {
    const entity = factory.create({
      plotId: 'Test Plot',
      varietyId: 'Test Variety',
      plantingDate: new Date(),
      expectedHarvest: new Date(),
      actualHarvest: new Date(),
      quantity: 100,
      status: CROP_STATUS.PLANTED,
      plantingMethod: CROP_PLANTING_METHODS.DIRECT_SEED,
      notes: 'Test Notes',
    });
    expect(entity.id.value).toBe(uuid);
    expect(entity.plotId).toBe('Test Plot');
    expect(entity.varietyId).toBe('Test Variety');
    expect(entity.plantingDate).toBeInstanceOf(Date);
    expect(entity.expectedHarvest).toBeInstanceOf(Date);
    expect(entity.actualHarvest).toBeInstanceOf(Date);
    expect(entity.quantity).toBe(100);
    expect(entity.status).toBeInstanceOf(CropStatusValueObject);
    expect(entity.plantingMethod).toBeInstanceOf(CropPlantingMethodValueObject);
    expect(entity.notes).toBe('Test Notes');
  });

  it('should reconstruct a CropEntity from primitives', () => {
    const entity = CropFactory.fromPrimitives({
      id: uuid,
      plotId: 'Test Plot',
      varietyId: 'Test Variety',
      plantingDate: new Date().toISOString(),
      expectedHarvest: new Date().toISOString(),
      actualHarvest: new Date().toISOString(),
      quantity: 100,
      status: CROP_STATUS.PLANTED,
      plantingMethod: CROP_PLANTING_METHODS.DIRECT_SEED,
      notes: 'Test Notes',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: undefined,
    });
    expect(entity).toBeInstanceOf(CropEntity);
    expect(entity.id.value).toBe(uuid);
    expect(entity.plotId).toBe('Test Plot');
    expect(entity.varietyId).toBe('Test Variety');
    expect(entity.plantingDate).toBeInstanceOf(Date);
    expect(entity.expectedHarvest).toBeInstanceOf(Date);
    expect(entity.actualHarvest).toBeInstanceOf(Date);
    expect(entity.quantity).toBe(100);
    expect(entity.status).toBeInstanceOf(CropStatusValueObject);
    expect(entity.plantingMethod).toBeInstanceOf(CropPlantingMethodValueObject);
    expect(entity.notes).toBe('Test Notes');
    expect(entity.createdAt.toISOString()).toBe(now.toISOString());
    expect(entity.updatedAt.toISOString()).toBe(now.toISOString());
    expect(entity.deletedAt).toBeUndefined();
  });
});
