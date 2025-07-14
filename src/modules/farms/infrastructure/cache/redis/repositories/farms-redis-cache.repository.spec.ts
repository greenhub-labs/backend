import { FarmsRedisCacheRepository } from './farms-redis-cache.repository';

describe('FarmsRedisCacheRepository', () => {
  it('should be defined', () => {
    const repo = new FarmsRedisCacheRepository({} as any);
    expect(repo).toBeDefined();
  });
}); 