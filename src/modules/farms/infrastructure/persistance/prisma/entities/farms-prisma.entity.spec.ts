import { FarmsPrismaEntity } from './farms-prisma.entity';

describe('FarmsPrismaEntity', () => {
  it('should map to and from Prisma correctly', () => {
    const entity = { id: 'test', value: 123 };
    const prisma = FarmsPrismaEntity.toPrisma(entity);
    const domain = FarmsPrismaEntity.fromPrisma(prisma);
    expect(domain).toEqual(entity);
  });
}); 