import { UserPrismaEntity } from './user-prisma.entity';
import { User } from '../../../../domain/entities/user.entity';
import { UserIdValueObject } from '../../../../domain/value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../../../../domain/value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../../../domain/value-objects/user-avatar-url/user-avatar-url.value-object';

describe('UserPrismaEntity', () => {
  const prismaUser = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://avatar.com/john.png',
    bio: 'Test user',
    isActive: true,
    isDeleted: false,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
    deletedAt: null,
  };

  describe('fromPrisma', () => {
    it('should map a Prisma user to a domain User entity', () => {
      const user = UserPrismaEntity.fromPrisma(prismaUser);
      expect(user).toBeInstanceOf(User);
      expect(user.id.value).toBe(prismaUser.id);
      expect(user.firstName?.value).toBe(prismaUser.firstName);
      expect(user.lastName?.value).toBe(prismaUser.lastName);
      expect(user.avatar?.value).toBe(prismaUser.avatar);
      expect(user.bio).toBe(prismaUser.bio);
      expect(user.isActive).toBe(prismaUser.isActive);
      expect(user.isDeleted).toBe(prismaUser.isDeleted);
      expect(user.createdAt.toISOString()).toBe(prismaUser.createdAt);
      expect(user.updatedAt.toISOString()).toBe(prismaUser.updatedAt);
      expect(user.deletedAt).toBeUndefined();
    });
    it('should handle missing optional fields', () => {
      const minimal = {
        ...prismaUser,
        firstName: undefined,
        lastName: undefined,
        avatar: undefined,
        bio: undefined,
        deletedAt: undefined,
      };
      const user = UserPrismaEntity.fromPrisma(minimal);
      expect(user.firstName).toBeUndefined();
      expect(user.lastName).toBeUndefined();
      expect(user.avatar).toBeUndefined();
      expect(user.bio).toBeUndefined();
      expect(user.deletedAt).toBeUndefined();
    });
    it('should handle deletedAt as date string', () => {
      const withDeleted = {
        ...prismaUser,
        deletedAt: '2023-01-03T00:00:00.000Z',
      };
      const user = UserPrismaEntity.fromPrisma(withDeleted);
      expect(user.deletedAt?.toISOString()).toBe('2023-01-03T00:00:00.000Z');
    });
  });

  describe('toPrisma', () => {
    const user = new User({
      id: new UserIdValueObject(prismaUser.id),
      firstName: new UserNameValueObject(prismaUser.firstName),
      lastName: new UserNameValueObject(prismaUser.lastName),
      avatar: new UserAvatarUrlValueObject(prismaUser.avatar),
      bio: prismaUser.bio,
      isActive: prismaUser.isActive,
      isDeleted: prismaUser.isDeleted,
      createdAt: new Date(prismaUser.createdAt),
      updatedAt: new Date(prismaUser.updatedAt),
      deletedAt: undefined,
      emitEvent: false,
    });
    it('should map a domain User entity to a Prisma user record', () => {
      const result = UserPrismaEntity.toPrisma(user);
      expect(result).toMatchObject({
        id: prismaUser.id,
        firstName: prismaUser.firstName,
        lastName: prismaUser.lastName,
        avatar: prismaUser.avatar,
        bio: prismaUser.bio,
        isActive: prismaUser.isActive,
        isDeleted: prismaUser.isDeleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: null,
      });
    });
    it('should handle optional fields as null', () => {
      const userWithoutOptional = new User({
        ...user,
        firstName: undefined,
        lastName: undefined,
        avatar: undefined,
        bio: undefined,
        deletedAt: undefined,
      });
      const result = UserPrismaEntity.toPrisma(userWithoutOptional);
      expect(result.firstName).toBeNull();
      expect(result.lastName).toBeNull();
      expect(result.avatar).toBeNull();
      expect(result.bio).toBeNull();
      expect(result.deletedAt).toBeNull();
    });
    it('should map deletedAt if present', () => {
      const userWithDeleted = new User({
        ...user,
        deletedAt: new Date('2023-01-03T00:00:00.000Z'),
      });
      const result = UserPrismaEntity.toPrisma(userWithDeleted);
      expect(result.deletedAt).toEqual(new Date('2023-01-03T00:00:00.000Z'));
    });
  });
});
