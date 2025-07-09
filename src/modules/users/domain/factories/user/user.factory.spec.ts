import { UserFactory } from './user.factory';
import { User } from '../../entities/user.entity';
import { UserNameValueObject } from '../../value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserPrimitive } from '../../primitives/user.primitive';

describe('UserFactory', () => {
  let factory: UserFactory;

  beforeEach(() => {
    factory = new UserFactory();
  });

  /**
   * Should create a User with only firstName
   */
  it('should create a User with only firstName', () => {
    const user = factory.create({ firstName: 'Alice' });
    expect(user).toBeInstanceOf(User);
    expect(user.firstName).toBeInstanceOf(UserNameValueObject);
    expect(user.firstName.value).toBe('Alice');
    expect(user.lastName).toBeUndefined();
    expect(user.avatar).toBeUndefined();
    expect(user.isActive).toBe(true);
    expect(user.isDeleted).toBe(false);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  /**
   * Should create a User with all fields
   */
  it('should create a User with all fields', () => {
    const user = factory.create({
      firstName: 'Bob',
      lastName: 'Smith',
      avatar: 'https://avatar.com/bob.png',
      bio: 'Farmer',
    });
    expect(user.firstName).toBeInstanceOf(UserNameValueObject);
    expect(user.firstName.value).toBe('Bob');
    expect(user.lastName).toBeInstanceOf(UserNameValueObject);
    expect(user.lastName.value).toBe('Smith');
    expect(user.avatar).toBeInstanceOf(UserAvatarUrlValueObject);
    expect(user.avatar.value).toBe('https://avatar.com/bob.png');
    expect(user.bio).toBe('Farmer');
    expect(user.isActive).toBe(true);
    expect(user.isDeleted).toBe(false);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  /**
   * Should reconstruct a User from primitives
   */
  it('should reconstruct a User from primitives', () => {
    const now = new Date();
    const primitive: UserPrimitive = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'Charlie',
      lastName: 'Brown',
      bio: 'Gardener',
      avatar: 'https://avatar.com/charlie.png',
      isActive: false,
      isDeleted: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    const user = UserFactory.fromPrimitives(primitive);
    expect(user).toBeInstanceOf(User);
    expect(user.id.value).toBe(primitive.id);
    expect(user.firstName).toBeInstanceOf(UserNameValueObject);
    expect(user.firstName.value).toBe('Charlie');
    expect(user.lastName).toBeInstanceOf(UserNameValueObject);
    expect(user.lastName.value).toBe('Brown');
    expect(user.avatar).toBeInstanceOf(UserAvatarUrlValueObject);
    expect(user.avatar.value).toBe('https://avatar.com/charlie.png');
    expect(user.bio).toBe('Gardener');
    expect(user.isActive).toBe(false);
    expect(user.isDeleted).toBe(true);
    expect(user.createdAt.toISOString()).toBe(now.toISOString());
    expect(user.updatedAt.toISOString()).toBe(now.toISOString());
  });
});
