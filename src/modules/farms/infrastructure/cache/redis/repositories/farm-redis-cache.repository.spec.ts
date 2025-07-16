import { FarmsRedisCacheRepository } from './farm-redis-cache.repository';
import { FarmEntity } from '../../../../domain/entities/farm.entity';
import { FarmRedisEntity } from '../entities/farm-redis.entity';

jest.mock('../entities/farms-redis.entity');

describe('FarmsRedisCacheRepository', () => {
  let repository: FarmsRedisCacheRepository;
  let redis: any;
  const farm = { id: { value: 'farm-1' } } as unknown as FarmEntity;

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
    (FarmRedisEntity.toRedis as jest.Mock).mockReturnValue('farm-json');
    (FarmRedisEntity.fromRedis as jest.Mock).mockReturnValue(farm);
    repository = new FarmsRedisCacheRepository(redis);
    jest.clearAllMocks();
  });

  describe('setMany', () => {
    it('should set multiple farms in cache', async () => {
      const pipeline = { setex: jest.fn().mockReturnThis(), exec: jest.fn() };
      redis.pipeline.mockReturnValue(pipeline);
      await repository.setMany([
        { key: 'farm-1', entity: farm },
        { key: 'farm-2', entity: farm },
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
    it('should return a map of found farms', async () => {
      redis.mget.mockResolvedValue(['farm-json', null]);
      (FarmRedisEntity.fromRedis as jest.Mock).mockReturnValue(farm);
      const result = await repository.getMany(['farm-1', 'farm-2']);
      expect(result.get('farm-1')).toBe(farm);
      expect(result.has('farm-2')).toBe(false);
    });
    it('should delete corrupted cache and skip on deserialization error', async () => {
      redis.mget.mockResolvedValue(['bad-json']);
      (FarmRedisEntity.fromRedis as jest.Mock).mockImplementation(() => {
        throw new Error('bad');
      });
      await repository.getMany(['farm-1']);
      expect(redis.del).toHaveBeenCalledWith('farms:farm-1');
    });
    it('should return empty map if keys is empty', async () => {
      const result = await repository.getMany([]);
      expect(result.size).toBe(0);
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple farms from cache', async () => {
      await repository.deleteMany(['farm-1', 'farm-2']);
      expect(redis.del).toHaveBeenCalledWith('farms:farm-1', 'farms:farm-2');
    });
    it('should do nothing if keys is empty', async () => {
      await repository.deleteMany([]);
      expect(redis.del).not.toHaveBeenCalled();
    });
  });

  describe('getKeys', () => {
    it('should get keys with prefix if not present', async () => {
      redis.keys.mockResolvedValue(['farms:farm-1']);
      await repository.getKeys('abc');
      expect(redis.keys).toHaveBeenCalledWith('farms:abc');
    });
    it('should get keys as is if prefix present', async () => {
      redis.keys.mockResolvedValue(['farms:farm-1']);
      await repository.getKeys('farms:abc');
      expect(redis.keys).toHaveBeenCalledWith('farms:abc');
    });
  });

  describe('expire', () => {
    it('should set TTL for a cache entry', async () => {
      await repository.expire('farm-1', 100);
      expect(redis.expire).toHaveBeenCalledWith('farms:farm-1', 100);
    });
  });

  describe('clear', () => {
    it('should delete all farm cache keys', async () => {
      redis.keys.mockResolvedValue(['farms:farm-1', 'farms:farm-2']);
      await repository.clear();
      expect(redis.del).toHaveBeenCalledWith('farms:farm-1', 'farms:farm-2');
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
      await repository.remove('farm-1');
      expect(spy).toHaveBeenCalledWith('farm-1');
    });
  });
});
