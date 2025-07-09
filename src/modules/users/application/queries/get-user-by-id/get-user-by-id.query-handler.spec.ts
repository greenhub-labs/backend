import { GetUserByIdQueryHandler } from './get-user-by-id.query-handler';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { UserRepository } from '../../ports/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { UserIdValueObject } from '../../../domain/value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../../../domain/value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../../domain/value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';

describe('GetUserByIdQueryHandler', () => {
  let handler: GetUserByIdQueryHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };
    handler = new GetUserByIdQueryHandler(userRepository);
  });

  it('should return UserDto if user exists', async () => {
    const user = new User({
      id: new UserIdValueObject('123e4567-e89b-12d3-a456-426614174000'),
      firstName: new UserNameValueObject('Alice'),
      lastName: new UserNameValueObject('Smith'),
      avatar: new UserAvatarUrlValueObject('https://avatar.com/alice.png'),
      bio: 'Gardener',
      isActive: true,
      isDeleted: false,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      emitEvent: false,
    });
    userRepository.findById.mockResolvedValue(user);
    const query = new GetUserByIdQuery('123e4567-e89b-12d3-a456-426614174000');
    const result = await handler.execute(query);
    expect(result).toBeInstanceOf(User);
    expect(result.id).toBe(user.id.value);
    expect(result.firstName).toBe(user.firstName?.value);
    expect(result.lastName).toBe(user.lastName?.value);
    expect(result.avatar).toBe(user.avatar?.value);
    expect(result.bio).toBe(user.bio);
    expect(result.isActive).toBe(user.isActive);
    expect(result.isDeleted).toBe(user.isDeleted);
    expect(result.createdAt).toBe(user.createdAt.toISOString());
    expect(result.updatedAt).toBe(user.updatedAt.toISOString());
  });

  it('should throw UserNotFoundException if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);
    const query = new GetUserByIdQuery('not-found-id');
    await expect(handler.execute(query)).rejects.toThrow(UserNotFoundException);
  });
});
