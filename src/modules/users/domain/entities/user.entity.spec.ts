import { User } from './user.entity';
import { UserIdValueObject } from '../value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserPrimitive } from '../primitives/user.primitive';
import { UserFactory } from '../factories/user/user.factory';

describe('User Entity', () => {
  const id = new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000');
  const firstName = new UserNameValueObject('John');
  const lastName = new UserNameValueObject('Doe');
  const avatar = new UserAvatarUrlValueObject('https://example.com/avatar.png');
  const bio = 'A test user';
  const isActive = true;
  const isDeleted = false;
  const createdAt = new Date('2024-01-01T00:00:00.000Z');
  const updatedAt = new Date('2024-01-02T00:00:00.000Z');

  it('should construct with value objects', () => {
    const user = new User({
      id,
      firstName,
      lastName,
      avatar,
      bio,
      isActive,
      isDeleted,
      createdAt,
      updatedAt,
    });
    expect(user.id).toBe(id);
    expect(user.firstName).toBe(firstName);
    expect(user.lastName).toBe(lastName);
    expect(user.avatar).toBe(avatar);
    expect(user.bio).toBe(bio);
    expect(user.isActive).toBe(isActive);
    expect(user.isDeleted).toBe(isDeleted);
    expect(user.createdAt).toBe(createdAt);
    expect(user.updatedAt).toBe(updatedAt);
  });

  it('should update fields immutably', () => {
    const user = new User({
      id,
      firstName,
      lastName,
      avatar,
      bio,
      isActive,
      isDeleted,
      createdAt,
      updatedAt,
    });
    const updated = user.update({
      firstName: 'Jane',
      avatar: 'https://example.com/new.png',
    });
    expect(updated).not.toBe(user);
    expect(updated.firstName.value).toBe('Jane');
    expect(updated.avatar.value).toBe('https://example.com/new.png');
    expect(updated.lastName).toBe(user.lastName);
    expect(updated.bio).toBe(user.bio);
    expect(updated.isActive).toBe(user.isActive);
    expect(updated.isDeleted).toBe(user.isDeleted);
    expect(updated.createdAt).toBe(user.createdAt);
    expect(updated.updatedAt.getTime()).toBeGreaterThan(
      user.updatedAt.getTime(),
    );
  });

  it('should convert to and from primitives', () => {
    const user = new User({
      id,
      firstName,
      lastName,
      avatar,
      bio,
      isActive,
      isDeleted,
      createdAt,
      updatedAt,
    });
    const primitives: UserPrimitive = user.toPrimitives();
    expect(primitives).toEqual({
      id: id.value,
      firstName: firstName.value,
      lastName: lastName.value,
      avatar: avatar.value,
      bio,
      isActive,
      isDeleted,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
    const from = UserFactory.fromPrimitives(primitives);
    expect(from.id.value).toBe(id.value);
    expect(from.firstName?.value).toBe(firstName.value);
    expect(from.lastName?.value).toBe(lastName.value);
    expect(from.avatar?.value).toBe(avatar.value);
    expect(from.bio).toBe(bio);
    expect(from.isActive).toBe(isActive);
    expect(from.isDeleted).toBe(isDeleted);
    expect(from.createdAt.toISOString()).toBe(createdAt.toISOString());
    expect(from.updatedAt.toISOString()).toBe(updatedAt.toISOString());
  });

  it('should be immutable (update does not mutate original)', () => {
    const user = new User({
      id,
      firstName,
      lastName,
      avatar,
      bio,
      isActive,
      isDeleted,
      createdAt,
      updatedAt,
    });
    const updated = user.update({ firstName: 'Jane' });
    expect(user.firstName.value).toBe('John');
    expect(updated.firstName.value).toBe('Jane');
  });
});
