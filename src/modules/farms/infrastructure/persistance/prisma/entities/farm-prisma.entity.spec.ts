import { FarmEntity } from '../../../../domain/entities/farm.entity';
import { FarmPrismaEntity } from './farm-prisma.entity';

describe('FarmPrismaEntity', () => {
  it('should map to and from Prisma correctly', () => {
    const entity = {
      id: 'test',
      name: 'test',
      description: 'test',
      country: 'test',
      state: 'test',
      city: 'test',
      postalCode: 'test',
      street: 'test',
      latitude: 1,
      longitude: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as unknown as FarmEntity;
    const prisma = FarmPrismaEntity.toPrisma(entity);
    const domain = FarmPrismaEntity.fromPrisma(prisma);
    expect(domain).toEqual(entity);
  });
});
