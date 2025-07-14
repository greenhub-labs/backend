import { FarmPrismaRepository } from './farm-prisma.repository';

describe('FarmPrismaRepository', () => {
  it('should be defined', () => {
    const repo = new FarmPrismaRepository({} as any);
    expect(repo).toBeDefined();
  });
});
