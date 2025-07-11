import { AuthRedisEntity } from './auth-redis.entity';
import { Auth } from '../../../../domain/entities/auth.entity';
import { AuthEmailValueObject } from '../../../../domain/value-objects/auth-email/auth-email.value-object';
import { AuthPasswordValueObject } from '../../../../domain/value-objects/auth-password/auth-password.value-object';

describe('AuthRedisEntity', () => {
  let auth: Auth;
  const validBcryptHash =
    '$2b$10$N9qo8uLOickgx2ZMRZoMye.IKdObgRhIm5wbWx0AZ4YqVa.I5oRYe'; // Valid bcrypt hash for 'password123'

  beforeEach(() => {
    auth = new Auth({
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: '456e7890-e89b-12d3-a456-426614174001',
      email: new AuthEmailValueObject('test@example.com'),
      password: AuthPasswordValueObject.fromHash(validBcryptHash),
      phone: '+1234567890',
      isVerified: true,
      lastLogin: new Date('2024-01-15T10:30:00Z'),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z'),
      deletedAt: undefined,
      emitEvent: false,
    });
  });

  describe('toRedis', () => {
    it('should convert Auth entity to Redis JSON string', () => {
      const redisData = AuthRedisEntity.toRedis(auth);
      const parsed = JSON.parse(redisData);

      expect(parsed).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '456e7890-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        password: validBcryptHash,
        phone: '+1234567890',
        isVerified: true,
        lastLogin: '2024-01-15T10:30:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
        deletedAt: undefined,
      });
    });

    it('should handle optional fields correctly', () => {
      const authWithoutOptionals = new Auth({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '456e7890-e89b-12d3-a456-426614174001',
        email: new AuthEmailValueObject('test@example.com'),
        password: AuthPasswordValueObject.fromHash(validBcryptHash),
        phone: undefined,
        isVerified: false,
        lastLogin: undefined,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        deletedAt: undefined,
        emitEvent: false,
      });

      const redisData = AuthRedisEntity.toRedis(authWithoutOptionals);
      const parsed = JSON.parse(redisData);

      expect(parsed.phone).toBeUndefined();
      expect(parsed.lastLogin).toBeUndefined();
      expect(parsed.deletedAt).toBeUndefined();
    });
  });

  describe('fromRedis', () => {
    it('should convert Redis JSON string to Auth entity', () => {
      const redisData = JSON.stringify({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '456e7890-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        password: validBcryptHash,
        phone: '+1234567890',
        isVerified: true,
        lastLogin: '2024-01-15T10:30:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
        deletedAt: undefined,
      });

      const authEntity = AuthRedisEntity.fromRedis(redisData);

      expect(authEntity.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(authEntity.userId).toBe('456e7890-e89b-12d3-a456-426614174001');
      expect(authEntity.email.value).toBe('test@example.com');
      expect(authEntity.password.value).toBe(validBcryptHash);
      expect(authEntity.phone).toBe('+1234567890');
      expect(authEntity.isVerified).toBe(true);
      expect(authEntity.lastLogin?.toISOString()).toBe(
        '2024-01-15T10:30:00.000Z',
      );
      expect(authEntity.createdAt.toISOString()).toBe(
        '2024-01-01T00:00:00.000Z',
      );
      expect(authEntity.updatedAt.toISOString()).toBe(
        '2024-01-15T10:30:00.000Z',
      );
      expect(authEntity.deletedAt).toBeUndefined();
    });

    it('should handle optional fields correctly when reading from Redis', () => {
      const redisData = JSON.stringify({
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '456e7890-e89b-12d3-a456-426614174001',
        email: 'test@example.com',
        password: validBcryptHash,
        phone: undefined,
        isVerified: false,
        lastLogin: undefined,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        deletedAt: undefined,
      });

      const authEntity = AuthRedisEntity.fromRedis(redisData);

      expect(authEntity.phone).toBeUndefined();
      expect(authEntity.lastLogin).toBeUndefined();
      expect(authEntity.deletedAt).toBeUndefined();
    });
  });

  describe('toRedisMany', () => {
    it('should convert multiple Auth entities to Redis JSON strings', () => {
      const auth2 = new Auth({
        id: '123e4567-e89b-12d3-a456-426614174002',
        userId: '456e7890-e89b-12d3-a456-426614174003',
        email: new AuthEmailValueObject('test2@example.com'),
        password: AuthPasswordValueObject.fromHash(validBcryptHash),
        phone: undefined,
        isVerified: false,
        lastLogin: undefined,
        createdAt: new Date('2024-01-02T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
        deletedAt: undefined,
        emitEvent: false,
      });

      const redisDataArray = AuthRedisEntity.toRedisMany([auth, auth2]);

      expect(redisDataArray).toHaveLength(2);

      const parsed1 = JSON.parse(redisDataArray[0]);
      const parsed2 = JSON.parse(redisDataArray[1]);

      expect(parsed1.email).toBe('test@example.com');
      expect(parsed2.email).toBe('test2@example.com');
    });
  });

  describe('fromRedisMany', () => {
    it('should convert multiple Redis JSON strings to Auth entities', () => {
      const redisDataArray = [
        JSON.stringify({
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '456e7890-e89b-12d3-a456-426614174001',
          email: 'test@example.com',
          password: validBcryptHash,
          phone: '+1234567890',
          isVerified: true,
          lastLogin: '2024-01-15T10:30:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z',
          deletedAt: undefined,
        }),
        JSON.stringify({
          id: '123e4567-e89b-12d3-a456-426614174002',
          userId: '456e7890-e89b-12d3-a456-426614174003',
          email: 'test2@example.com',
          password: validBcryptHash,
          phone: undefined,
          isVerified: false,
          lastLogin: undefined,
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
          deletedAt: undefined,
        }),
      ];

      const authEntities = AuthRedisEntity.fromRedisMany(redisDataArray);

      expect(authEntities).toHaveLength(2);
      expect(authEntities[0].email.value).toBe('test@example.com');
      expect(authEntities[1].email.value).toBe('test2@example.com');
    });

    it('should filter out null and undefined values', () => {
      const redisDataArray = [
        JSON.stringify({
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '456e7890-e89b-12d3-a456-426614174001',
          email: 'test@example.com',
          password: validBcryptHash,
          phone: undefined,
          isVerified: true,
          lastLogin: undefined,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          deletedAt: undefined,
        }),
        null as any,
        undefined as any,
      ];

      const authEntities = AuthRedisEntity.fromRedisMany(redisDataArray);

      expect(authEntities).toHaveLength(1);
      expect(authEntities[0].email.value).toBe('test@example.com');
    });
  });

  describe('Cache key generation', () => {
    it('should generate correct user cache key', () => {
      const userId = '456e7890-e89b-12d3-a456-426614174001';
      const cacheKey = AuthRedisEntity.generateUserCacheKey(userId);
      expect(cacheKey).toBe('auth:user:456e7890-e89b-12d3-a456-426614174001');
    });

    it('should generate correct email cache key', () => {
      const email = 'Test@Example.COM';
      const cacheKey = AuthRedisEntity.generateEmailCacheKey(email);
      expect(cacheKey).toBe('auth:email:test@example.com');
    });

    it('should generate correct session cache key', () => {
      const sessionId = 'session-123-456';
      const cacheKey = AuthRedisEntity.generateSessionCacheKey(sessionId);
      expect(cacheKey).toBe('auth:session:session-123-456');
    });

    it('should generate multiple user cache keys', () => {
      const userIds = ['user1', 'user2', 'user3'];
      const cacheKeys = AuthRedisEntity.generateUserCacheKeys(userIds);
      expect(cacheKeys).toEqual([
        'auth:user:user1',
        'auth:user:user2',
        'auth:user:user3',
      ]);
    });

    it('should generate multiple email cache keys', () => {
      const emails = ['Test1@Example.com', 'TEST2@EXAMPLE.COM'];
      const cacheKeys = AuthRedisEntity.generateEmailCacheKeys(emails);
      expect(cacheKeys).toEqual([
        'auth:email:test1@example.com',
        'auth:email:test2@example.com',
      ]);
    });
  });

  describe('Cache key extraction', () => {
    it('should extract user ID from user cache key', () => {
      const cacheKey = 'auth:user:456e7890-e89b-12d3-a456-426614174001';
      const userId = AuthRedisEntity.extractUserIdFromCacheKey(cacheKey);
      expect(userId).toBe('456e7890-e89b-12d3-a456-426614174001');
    });

    it('should return null for invalid user cache key format', () => {
      const invalidKey = 'invalid:key:format';
      const userId = AuthRedisEntity.extractUserIdFromCacheKey(invalidKey);
      expect(userId).toBeNull();
    });

    it('should extract email from email cache key', () => {
      const cacheKey = 'auth:email:test@example.com';
      const email = AuthRedisEntity.extractEmailFromCacheKey(cacheKey);
      expect(email).toBe('test@example.com');
    });

    it('should return null for invalid email cache key format', () => {
      const invalidKey = 'invalid:key:format';
      const email = AuthRedisEntity.extractEmailFromCacheKey(invalidKey);
      expect(email).toBeNull();
    });

    it('should extract session ID from session cache key', () => {
      const cacheKey = 'auth:session:session-123-456';
      const sessionId = AuthRedisEntity.extractSessionIdFromCacheKey(cacheKey);
      expect(sessionId).toBe('session-123-456');
    });

    it('should return null for invalid session cache key format', () => {
      const invalidKey = 'invalid:key:format';
      const sessionId =
        AuthRedisEntity.extractSessionIdFromCacheKey(invalidKey);
      expect(sessionId).toBeNull();
    });
  });

  describe('Roundtrip conversion', () => {
    it('should maintain data integrity through toRedis -> fromRedis conversion', () => {
      const redisData = AuthRedisEntity.toRedis(auth);
      const convertedAuth = AuthRedisEntity.fromRedis(redisData);

      expect(convertedAuth.id).toBe(auth.id);
      expect(convertedAuth.userId).toBe(auth.userId);
      expect(convertedAuth.email.value).toBe(auth.email.value);
      expect(convertedAuth.password.value).toBe(auth.password.value);
      expect(convertedAuth.phone).toBe(auth.phone);
      expect(convertedAuth.isVerified).toBe(auth.isVerified);
      expect(convertedAuth.lastLogin?.getTime()).toBe(
        auth.lastLogin?.getTime(),
      );
      expect(convertedAuth.createdAt.getTime()).toBe(auth.createdAt.getTime());
      expect(convertedAuth.updatedAt.getTime()).toBe(auth.updatedAt.getTime());
      expect(convertedAuth.deletedAt).toBe(auth.deletedAt);
    });
  });
});
