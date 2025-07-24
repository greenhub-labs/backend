import { CropVarietyEntity } from '../../../../domain/entities/crop-variety.entity';
import { CropVarietyRedisEntity } from '../entities/crop-variety-redis.entity';
import { CropsVarietyRedisCacheRepository } from './crop-variety-redis-cache.repository';

jest.mock('../entities/crop-variety-redis.entity');

describe('CropsVarietyRedisCacheRepository', () => {
  let repository: CropsVarietyRedisCacheRepository;
  let redis: any;
  const cropVariety = {
    id: { value: 'crop-variety-1' },
  } as unknown as CropVarietyEntity;

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
    (CropVarietyRedisEntity.toRedis as jest.Mock).mockReturnValue(
      'crop-variety-json',
    );
    (CropVarietyRedisEntity.fromRedis as jest.Mock).mockReturnValue(
      cropVariety,
    );
    repository = new CropsVarietyRedisCacheRepository(redis);
    jest.clearAllMocks();
  });

  describe('setMany', () => {
    it('should set multiple plots in cache', async () => {
      const pipeline = { setex: jest.fn().mockReturnThis(), exec: jest.fn() };
      redis.pipeline.mockReturnValue(pipeline);
      await repository.setMany([
        { key: 'crop-variety-1', entity: cropVariety },
        { key: 'crop-variety-2', entity: cropVariety },
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
      (CropVarietyRedisEntity.fromRedis as jest.Mock).mockImplementation(() => {
        throw new Error('bad');
      });
      await repository.getMany(['crop-1']);
      expect(redis.del).toHaveBeenCalledWith('crops-varieties:crop-1');
    });
    it('should return empty map if keys is empty', async () => {
      const result = await repository.getMany([]);
      expect(result.length).toBe(0);
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple plots from cache', async () => {
      await repository.deleteMany(['crop-variety-1', 'crop-variety-2']);
      expect(redis.del).toHaveBeenCalledWith(
        'crops-varieties:crop-variety-1',
        'crops-varieties:crop-variety-2',
      );
    });
    it('should do nothing if keys is empty', async () => {
      await repository.deleteMany([]);
      expect(redis.del).not.toHaveBeenCalled();
    });
  });

  describe('getKeys', () => {
    it('should get keys with prefix if not present', async () => {
      redis.keys.mockResolvedValue(['crops-varieties:crop-variety-1']);
      await repository.getKeys('abc');
      expect(redis.keys).toHaveBeenCalledWith('crops-varieties:abc');
    });
    it('should get keys as is if prefix present', async () => {
      redis.keys.mockResolvedValue(['crops-varieties:crop-variety-1']);
      await repository.getKeys('crops-varieties:abc');
      expect(redis.keys).toHaveBeenCalledWith('crops-varieties:abc');
    });
  });

  describe('expire', () => {
    it('should set TTL for a cache entry', async () => {
      await repository.expire('crop-variety-1', 10);
      expect(redis.expire).toHaveBeenCalledWith(
        'crops-varieties:crop-variety-1',
        10,
      );
    });
  });

  describe('clear', () => {
    it('should delete all plots cache keys', async () => {
      redis.keys.mockResolvedValue([
        'crops-varieties:crop-variety-1',
        'crops-varieties:crop-variety-2',
      ]);
      await repository.clear();
      expect(redis.del).toHaveBeenCalledWith(
        'crops-varieties:crop-variety-1',
        'crops-varieties:crop-variety-2',
      );
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
      await repository.remove('crop-variety-1');
      expect(spy).toHaveBeenCalledWith('crop-variety-1');
    });
  });
});
