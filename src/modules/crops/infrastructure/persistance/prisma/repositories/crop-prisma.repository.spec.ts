import { CropPrismaRepository } from './crop-prisma.repository';

describe('CropPrismaRepository', () => {
  it('should be defined', () => {
    const repo = new CropPrismaRepository({} as any);
    expect(repo).toBeDefined();
  });
});
