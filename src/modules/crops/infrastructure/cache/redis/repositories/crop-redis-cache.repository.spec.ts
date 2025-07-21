import { CropEntity } from '../../../../domain/entities/crop.entity';
import { CropRedisEntity } from '../entities/crop-redis.entity';
import { CropsRedisCacheRepository } from './crop-redis-cache.repository';

jest.mock('../entities/plots-redis.entity');

describe('CropsRedisCacheRepository', () => {
  let repository: CropsRedisCacheRepository;
  let redis: any;
  const crop = { id: { value: 'crop-1' } } as unknown as CropEntity;

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
    (CropRedisEntity.toRedis as jest.Mock).mockReturnValue('crop-json');
    (CropRedisEntity.fromRedis as jest.Mock).mockReturnValue(crop);
    repository = new CropsRedisCacheRepository(redis);
    jest.clearAllMocks();
  });

  describe('setMany', () => {
    it('should set multiple plots in cache', async () => {
      const pipeline = { setex: jest.fn().mockReturnThis(), exec: jest.fn() };
      redis.pipeline.mockReturnValue(pipeline);
      await repository.setMany([
        { key: 'crop-1', entity: crop },
        { key: 'crop-2', entity: crop },
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
      (CropRedisEntity.fromRedis as jest.Mock).mockImplementation(() => {
        throw new Error('bad');
      });
      await repository.getMany(['crop-1']);
      expect(redis.del).toHaveBeenCalledWith('crops:crop-1');
    });
    it('should return empty map if keys is empty', async () => {
      const result = await repository.getMany([]);
      expect(result.length).toBe(0);
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple plots from cache', async () => {
      await repository.deleteMany(['crop-1', 'crop-2']);
      expect(redis.del).toHaveBeenCalledWith('crops:crop-1', 'crops:crop-2');
    });
    it('should do nothing if keys is empty', async () => {
      await repository.deleteMany([]);
      expect(redis.del).not.toHaveBeenCalled();
    });
  });

  describe('getKeys', () => {
    it('should get keys with prefix if not present', async () => {
      redis.keys.mockResolvedValue(['crops:crop-1']);
      await repository.getKeys('abc');
      expect(redis.keys).toHaveBeenCalledWith('crops:abc');
    });
    it('should get keys as is if prefix present', async () => {
      redis.keys.mockResolvedValue(['crops:crop-1']);
      await repository.getKeys('crops:abc');
      expect(redis.keys).toHaveBeenCalledWith('crops:abc');
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
