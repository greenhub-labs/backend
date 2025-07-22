import { PlotEntity } from '../../../../domain/entities/plot.entity';
import { PlotRedisEntity } from '../entities/plot-redis.entity';
import { PlotsRedisCacheRepository } from './plot-redis-cache.repository';

jest.mock('../entities/plot-redis.entity');

describe('PlotsRedisCacheRepository', () => {
  let repository: PlotsRedisCacheRepository;
  let redis: any;
  const plot = { id: { value: 'plot-1' } } as unknown as PlotEntity;

  beforeEach(() => {
    redis = {
      setex: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      pipeline: jest.fn(() => ({
        setex: jest.fn().mockReturnThis(),
        exec: jest.fn(),
      })),
      mget: jest.fn(),
      keys: jest.fn(),
      expire: jest.fn(),
    };
    (PlotRedisEntity.toRedis as jest.Mock).mockReturnValue('plot-json');
    (PlotRedisEntity.fromRedis as jest.Mock).mockReturnValue(plot);
    repository = new PlotsRedisCacheRepository(redis);
    jest.clearAllMocks();
  });

  describe('setMany', () => {
    it('should set multiple plots in cache', async () => {
      const pipeline = { setex: jest.fn().mockReturnThis(), exec: jest.fn() };
      redis.pipeline.mockReturnValue(pipeline);
      await repository.setMany([
        { key: 'plot-1', entity: plot },
        { key: 'plot-2', entity: plot },
      ]);
      expect(pipeline.setex).toHaveBeenCalledTimes(2);
      expect(pipeline.exec).toHaveBeenCalled();
    });
    it('should do nothing if entries is empty', async () => {
      await repository.setMany([]);
      expect(redis.pipeline().exec).not.toHaveBeenCalled();
    });
  });

  describe('getMany', () => {
    it('should delete corrupted cache and skip on deserialization error', async () => {
      redis.mget.mockResolvedValue(['bad-json']);
      (PlotRedisEntity.fromRedis as jest.Mock).mockImplementation(() => {
        throw new Error('bad');
      });
      await repository.getMany(['plot-1']);
      expect(redis.del).toHaveBeenCalledWith('plots:plot-1');
    });
    it('should return empty map if keys is empty', async () => {
      const result = await repository.getMany([]);
      expect(result.length).toBe(0);
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple plots from cache', async () => {
      await repository.deleteMany(['plot-1', 'plot-2']);
      expect(redis.del).toHaveBeenCalledWith('plots:plot-1', 'plots:plot-2');
    });
    it('should do nothing if keys is empty', async () => {
      await repository.deleteMany([]);
      expect(redis.del).not.toHaveBeenCalled();
    });
  });

  describe('getKeys', () => {
    it('should get keys with prefix if not present', async () => {
      redis.keys.mockResolvedValue(['plots:plot-1']);
      await repository.getKeys('abc');
      expect(redis.keys).toHaveBeenCalledWith('plots:abc');
    });
    it('should get keys as is if prefix present', async () => {
      redis.keys.mockResolvedValue(['plots:plot-1']);
      await repository.getKeys('plots:abc');
      expect(redis.keys).toHaveBeenCalledWith('plots:abc');
    });
  });

  describe('expire', () => {
    it('should set TTL for a cache entry', async () => {
      await repository.expire('plot-1', 10);
      expect(redis.expire).toHaveBeenCalledWith('plots:plot-1', 10);
    });
  });

  describe('clear', () => {
    it('should delete all plots cache keys', async () => {
      redis.keys.mockResolvedValue(['plots:plot-1', 'plots:plot-2']);
      await repository.clear();
      expect(redis.del).toHaveBeenCalledWith('plots:plot-1', 'plots:plot-2');
    });
    it('should do nothing if no keys', async () => {
      redis.keys.mockResolvedValue([]);
      await repository.clear();
      expect(redis.del).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call delete', async () => {
      const spy = jest.spyOn(repository, 'delete');
      await repository.remove('plot-1');
      expect(spy).toHaveBeenCalledWith('plot-1');
    });
  });
});
