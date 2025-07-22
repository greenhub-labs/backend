import { CropStatus, PlantingMethod } from '@prisma/client';
import { CropEntity } from '../../../../domain/entities/crop.entity';
import { CropActualHarvestDateValueObject } from '../../../../domain/value-objects/crop-actual-harvest-date/crop-actual-harvest-date.value-object';
import { CropExpectedHarvestDateValueObject } from '../../../../domain/value-objects/crop-expected-harvest-date/crop-expected-harvest-date.value-object';
import { CropIdValueObject } from '../../../../domain/value-objects/crop-id/crop-id.value-object';
import { CropPlantingDateValueObject } from '../../../../domain/value-objects/crop-planting-date/crop-planting-date.value-object';
import { CropPlantingMethodValueObject } from '../../../../domain/value-objects/crop-planting-method/crop-planting-method.value-object';
import { CropStatusValueObject } from '../../../../domain/value-objects/crop-status/crop-status.value-object';
import { CropPrismaEntity } from './crop-prisma.entity';

describe('CropPrismaEntity', () => {
  it('should map to and from Prisma correctly', () => {
    const entity = new CropEntity({
      id: new CropIdValueObject('550e8400-e29b-41d4-a716-446655440000'),
      plotId: 'plot-123',
      varietyId: 'variety-123',
      plantingDate: new CropPlantingDateValueObject(new Date('2023-01-01')),
      expectedHarvest: new CropExpectedHarvestDateValueObject(
        new Date('2023-06-01'),
      ),
      actualHarvest: new CropActualHarvestDateValueObject(
        new Date('2023-06-01'),
      ),
      quantity: 100,
      status: new CropStatusValueObject('PLANTED'),
      plantingMethod: new CropPlantingMethodValueObject('DIRECT_SEED'),
      notes: 'Test notes',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      emitEvent: false,
    });

    const prisma = CropPrismaEntity.toPrismaCreate(entity);
    const domain = CropPrismaEntity.fromPrisma({
      id: '550e8400-e29b-41d4-a716-446655440000',
      plotId: 'plot-123',
      varietyId: 'variety-123',
      plantingDate: new Date('2023-01-01'),
      expectedHarvest: new Date('2023-06-01'),
      actualHarvest: new Date('2023-06-01'),
      quantity: 100,
      status: CropStatus.PLANTED,
      plantingMethod: PlantingMethod.DIRECT_SEED,
      notes: 'Test notes',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      deletedAt: null,
    });

    expect(domain.id.value).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(domain.plotId).toBe('plot-123');
    expect(domain.varietyId).toBe('variety-123');
    expect(domain.quantity).toBe(100);
    expect(domain.status.value).toBe('PLANTED');
    expect(domain.plantingMethod?.value).toBe('DIRECT_SEED');
    expect(domain.notes).toBe('Test notes');
  });
});
