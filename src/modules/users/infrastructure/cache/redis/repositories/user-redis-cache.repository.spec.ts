import { UserRedisCacheRepository } from './user-redis-cache.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserRedisEntity } from '../entities/user-redis.entity';

jest.mock('../entities/user-redis.entity');

const mockRedis = () => ({
  setex: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  keys: jest.fn(),
  pipeline: jest.fn(() => ({
    setex: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  })),
  mget: jest.fn(),
  expire: jest.fn(),
});

describe('UserRedisCacheRepository', () => {
  let repository: UserRedisCacheRepository;
  let redis: ReturnType<typeof mockRedis>;
  const user = { id: { value: 'user-1' } } as unknown as User;

  beforeEach(() => {
    redis = mockRedis();
    repository = new UserRedisCacheRepository(redis as any);
    jest.clearAllMocks();
  });

  describe('set', () => {
    it('should set user in cache with default TTL', async () => {
      (UserRedisEntity.toRedis as jest.Mock).mockReturnValue('user-json');
      await repository.set('user-1', user);
      expect(redis.setex).toHaveBeenCalledWith(
        'user:user-1',
        3600,
        'user-json',
      );
    });
    it('should set user in cache with custom TTL', async () => {
      (UserRedisEntity.toRedis as jest.Mock).mockReturnValue('user-json');
      await repository.set('user-1', user, 100);
      expect(redis.setex).toHaveBeenCalledWith('user:user-1', 100, 'user-json');
    });
  });

  describe('get', () => {
    it('should return user if found', async () => {
      redis.get.mockResolvedValue('user-json');
      (UserRedisEntity.fromRedis as jest.Mock).mockReturnValue(user);
      const result = await repository.get('user-1');
      expect(redis.get).toHaveBeenCalledWith('user:user-1');
      expect(result).toBe(user);
    });
    it('should return null if not found', async () => {
      redis.get.mockResolvedValue(null);
      const result = await repository.get('user-1');
      expect(result).toBeNull();
    });
    it('should delete corrupted cache and return null on deserialization error', async () => {
      redis.get.mockResolvedValue('corrupt');
      (UserRedisEntity.fromRedis as jest.Mock).mockImplementation(() => {
        throw new Error('bad');
      });
      const result = await repository.get('user-1');
      expect(redis.del).toHaveBeenCalledWith('user:user-1');
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete user from cache', async () => {
      await repository.delete('user-1');
      expect(redis.del).toHaveBeenCalledWith('user:user-1');
    });
  });

  describe('exists', () => {
    it('should return true if exists', async () => {
      redis.exists.mockResolvedValue(1);
      const result = await repository.exists('user-1');
      expect(result).toBe(true);
    });
    it('should return false if not exists', async () => {
      redis.exists.mockResolvedValue(0);
      const result = await repository.exists('user-1');
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should delete all user cache keys', async () => {
      redis.keys.mockResolvedValue(['user:user-1', 'user:user-2']);
      await repository.clear();
      expect(redis.del).toHaveBeenCalledWith('user:user-1', 'user:user-2');
    });
    it('should do nothing if no keys', async () => {
      redis.keys.mockResolvedValue([]);
      await repository.clear();
      expect(redis.del).not.toHaveBeenCalled();
    });
  });

  describe('setMany', () => {
    it('should set multiple users in cache', async () => {
      const pipeline = { setex: jest.fn().mockReturnThis(), exec: jest.fn() };
      redis.pipeline.mockReturnValue(pipeline);
      (UserRedisEntity.toRedis as jest.Mock).mockReturnValue('user-json');
      await repository.setMany([
        { key: 'user-1', user },
        { key: 'user-2', user },
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
    it('should return a map of found users', async () => {
      redis.mget.mockResolvedValue(['user-json', null]);
      (UserRedisEntity.fromRedis as jest.Mock).mockReturnValue(user);
      const result = await repository.getMany(['user-1', 'user-2']);
      expect(result.get('user-1')).toBe(user);
      expect(result.has('user-2')).toBe(false);
    });
    it('should delete corrupted cache and skip on deserialization error', async () => {
      redis.mget.mockResolvedValue(['bad-json']);
      (UserRedisEntity.fromRedis as jest.Mock).mockImplementation(() => {
        throw new Error('bad');
      });
      await repository.getMany(['user-1']);
      expect(redis.del).toHaveBeenCalledWith('user:user-1');
    });
    it('should return empty map if keys is empty', async () => {
      const result = await repository.getMany([]);
      expect(result.size).toBe(0);
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple users from cache', async () => {
      await repository.deleteMany(['user-1', 'user-2']);
      expect(redis.del).toHaveBeenCalledWith('user:user-1', 'user:user-2');
    });
    it('should do nothing if keys is empty', async () => {
      await repository.deleteMany([]);
      expect(redis.del).not.toHaveBeenCalled();
    });
  });

  describe('getKeys', () => {
    it('should get keys with prefix if not present', async () => {
      redis.keys.mockResolvedValue(['user:user-1']);
      await repository.getKeys('abc');
      expect(redis.keys).toHaveBeenCalledWith('user:abc');
    });
    it('should get keys as is if prefix present', async () => {
      redis.keys.mockResolvedValue(['user:user-1']);
      await repository.getKeys('user:abc');
      expect(redis.keys).toHaveBeenCalledWith('user:abc');
    });
  });

  describe('expire', () => {
    it('should set TTL for a cache entry', async () => {
      await repository.expire('user-1', 100);
      expect(redis.expire).toHaveBeenCalledWith('user:user-1', 100);
    });
  });
});
