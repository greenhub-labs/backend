import { FarmsPrismaRepository } from './farms-prisma.repository';

describe('FarmsPrismaRepository', () => {
  it('should be defined', () => {
    const repo = new FarmsPrismaRepository({} as any);
    expect(repo).toBeDefined();
  });
}); 