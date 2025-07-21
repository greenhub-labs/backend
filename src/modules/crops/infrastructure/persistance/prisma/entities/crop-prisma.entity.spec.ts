import { CropStatus, PlantingMethod } from '@prisma/client';
import { CropEntity } from '../../../../domain/entities/crop.entity';
import { CropPrismaEntity } from './crop-prisma.entity';

describe('CropPrismaEntity', () => {
  it('should map to and from Prisma correctly', () => {
    const entity = {
      id: 'test',
      plotId: 'test',
      varietyId: 'test',
      plantingDate: new Date(),
      expectedHarvest: new Date(),
      actualHarvest: new Date(),
      quantity: 1,
      status: CropStatus.PLANTED,
      plantingMethod: PlantingMethod.DIRECT_SEED,
      notes: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as CropEntity;
    const prisma = CropPrismaEntity.toPrismaCreate(entity);
    console.log(prisma);
    const domain = CropPrismaEntity.fromPrisma(prisma);
    expect(domain).toEqual(entity);
  });
});
