import { PlotPrismaRepository } from './plot-prisma.repository';

describe('PlotPrismaRepository', () => {
  it('should be defined', () => {
    const repo = new PlotPrismaRepository({} as any);
    expect(repo).toBeDefined();
  });
});
