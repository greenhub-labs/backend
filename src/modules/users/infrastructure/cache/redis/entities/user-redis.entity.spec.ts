import { UserRedisEntity } from './user-redis.entity';
import { User } from '../../../../domain/entities/user.entity';
import { UserIdValueObject } from '../../../../domain/value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../../../../domain/value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../../../domain/value-objects/user-avatar-url/user-avatar-url.value-object';

// Mock data for UserPrimitive
const userPrimitive = {
  id: 'b3e1c2d4-5f6a-4b8c-8d0e-1f2a3b4c5d6e', // UUID v4 válido
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://avatar.com/john.png',
  bio: 'Test user',
  isActive: true,
  isDeleted: false,
  createdAt: new Date('2023-01-01T00:00:00.000Z').toISOString(),
  updatedAt: new Date('2023-01-02T00:00:00.000Z').toISOString(),
  deletedAt: null,
};

const user = new User({
  id: new UserIdValueObject(userPrimitive.id),
  firstName: new UserNameValueObject(userPrimitive.firstName),
  lastName: new UserNameValueObject(userPrimitive.lastName),
  avatar: new UserAvatarUrlValueObject(userPrimitive.avatar),
  bio: userPrimitive.bio,
  isActive: userPrimitive.isActive,
  isDeleted: userPrimitive.isDeleted,
  createdAt: new Date(userPrimitive.createdAt),
  updatedAt: new Date(userPrimitive.updatedAt),
  deletedAt: undefined,
  emitEvent: false,
});

describe('UserRedisEntity', () => {
  describe('toRedis', () => {
    it('should serialize a User entity to JSON string', () => {
      const json = UserRedisEntity.toRedis(user);
      expect(typeof json).toBe('string');
      const parsed = JSON.parse(json);
      expect(parsed).toMatchObject({
        id: user.id.value,
        firstName: user.firstName?.value,
        lastName: user.lastName?.value,
        avatar: user.avatar?.value,
        bio: user.bio,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        // deletedAt eliminado porque JSON.stringify omite undefined
      });
    });
    it('should handle optional fields', () => {
      const userWithoutAvatar = new User({
        ...user,
        avatar: undefined,
        deletedAt: undefined,
      });
      const json = UserRedisEntity.toRedis(userWithoutAvatar);
      const parsed = JSON.parse(json);
      expect(parsed.avatar).toBeUndefined();
      expect(parsed.deletedAt).toBeUndefined();
    });
  });

  describe('fromRedis', () => {
    it('should deserialize a JSON string to a User entity', () => {
      const json = JSON.stringify(userPrimitive);
      const entity = UserRedisEntity.fromRedis(json);
      expect(entity).toBeInstanceOf(User);
      expect(entity.id.value).toBe(userPrimitive.id);
      expect(entity.firstName?.value).toBe(userPrimitive.firstName);
      expect(entity.lastName?.value).toBe(userPrimitive.lastName);
      expect(entity.avatar?.value).toBe(userPrimitive.avatar);
      expect(entity.bio).toBe(userPrimitive.bio);
      expect(entity.isActive).toBe(userPrimitive.isActive);
      expect(entity.isDeleted).toBe(userPrimitive.isDeleted);
      expect(entity.createdAt.toISOString()).toBe(userPrimitive.createdAt);
      expect(entity.updatedAt.toISOString()).toBe(userPrimitive.updatedAt);
      expect(entity.deletedAt).toBeUndefined();
    });
    it('should handle missing optional fields', () => {
      const primitive = {
        ...userPrimitive,
        avatar: undefined,
        deletedAt: undefined,
      };
      const json = JSON.stringify(primitive);
      const entity = UserRedisEntity.fromRedis(json);
      expect(entity.avatar).toBeUndefined();
      expect(entity.deletedAt).toBeUndefined();
    });
    it('should throw on invalid JSON', () => {
      expect(() => UserRedisEntity.fromRedis('not-json')).toThrow();
    });
  });

  describe('toRedisMany', () => {
    it('should serialize an array of Users to array of JSON strings', () => {
      const users = [user, user];
      const result = UserRedisEntity.toRedisMany(users);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      result.forEach((json) => {
        expect(typeof json).toBe('string');
      });
    });
    it('should handle empty array', () => {
      expect(UserRedisEntity.toRedisMany([])).toEqual([]);
    });
  });

  describe('fromRedisMany', () => {
    it('should deserialize array of JSON strings to array of Users', () => {
      const jsons = [
        JSON.stringify(userPrimitive),
        JSON.stringify(userPrimitive),
      ];
      const result = UserRedisEntity.fromRedisMany(jsons);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      result.forEach((entity) => {
        expect(entity).toBeInstanceOf(User);
      });
    });
    it('should filter out null/undefined values', () => {
      const jsons = [JSON.stringify(userPrimitive), null, undefined];
      const result = UserRedisEntity.fromRedisMany(jsons as any);
      expect(result.length).toBe(1);
    });
    it('should handle empty array', () => {
      expect(UserRedisEntity.fromRedisMany([])).toEqual([]);
    });
  });

  describe('generateCacheKey', () => {
    it('should generate the correct cache key for a userId', () => {
      expect(UserRedisEntity.generateCacheKey('abc')).toBe('user:abc');
    });
  });

  describe('generateCacheKeys', () => {
    it('should generate cache keys for multiple userIds', () => {
      const ids = ['a', 'b', 'c'];
      expect(UserRedisEntity.generateCacheKeys(ids)).toEqual([
        'user:a',
        'user:b',
        'user:c',
      ]);
    });
    it('should handle empty array', () => {
      expect(UserRedisEntity.generateCacheKeys([])).toEqual([]);
    });
  });

  describe('extractUserIdFromCacheKey', () => {
    it('should extract userId from valid cache key', () => {
      expect(UserRedisEntity.extractUserIdFromCacheKey('user:123')).toBe('123');
    });
    it('should return null for invalid cache key', () => {
      expect(
        UserRedisEntity.extractUserIdFromCacheKey('invalid:123'),
      ).toBeNull();
      expect(UserRedisEntity.extractUserIdFromCacheKey('user-123')).toBeNull();
      expect(UserRedisEntity.extractUserIdFromCacheKey('user:')).toBeNull();
    });
  });
});
