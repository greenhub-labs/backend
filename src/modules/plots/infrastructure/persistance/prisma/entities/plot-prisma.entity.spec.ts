import { PlotEntity } from '../../../../domain/entities/plot.entity';
import { PlotPrismaEntity } from './plot-prisma.entity';

describe('PlotPrismaEntity', () => {
  it('should map to and from Prisma correctly', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const entity = new PlotEntity({
      id: { value: uuid },
      name: { value: 'Test Plot' },
      farmId: 'farm-1',
      status: { value: 'ACTIVE' },
      soilType: { value: 'SANDY' },
      soilPh: 7,
      description: 'desc',
      dimensions: {
        width: 10,
        length: 20,
        height: 1,
        unitMeasurement: 'METERS',
        area: 200,
        perimeter: 60,
        volume: 200,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    const prisma = PlotPrismaEntity.toPrismaCreate(entity);
    // Create a flat object for fromPrisma that matches the expected structure
    const flatPrismaData = {
      id: prisma.id,
      name: prisma.name,
      farmId: entity.farmId, // Use the original farmId directly
      status: prisma.status,
      soilType: prisma.soilType,
      soilPh: prisma.soilPh,
      description: prisma.description,
      width: prisma.width,
      length: prisma.length,
      height: prisma.height,
      unitMeasurement: prisma.unitMeasurement,
      area: prisma.area,
      perimeter: prisma.perimeter,
      volume: prisma.volume,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
      deletedAt: prisma.deletedAt,
    };
    const domain = PlotPrismaEntity.fromPrisma(flatPrismaData);
    expect(domain.id.value).toEqual(entity.id.value);
    expect(domain.name.value).toEqual(entity.name.value);
    expect(domain.farmId).toEqual(entity.farmId);
  });
});
