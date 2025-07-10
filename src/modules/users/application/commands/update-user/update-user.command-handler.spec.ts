import { UpdateUserCommandHandler } from './update-user.command-handler';
import { UpdateUserCommand } from './update-user.command';
import { UserRepository } from '../../ports/user.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';
import { User } from '../../../domain/entities/user.entity';
import { UserIdValueObject } from '../../../domain/value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../../../domain/value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../../domain/value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserUpdatedDomainEvent } from '../../../domain/events/user-updated/user-updated.domain-event';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';
import { UserCacheRepository } from '../../ports/user-cache.repository';

describe('UpdateUserCommandHandler', () => {
  let handler: UpdateUserCommandHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;
  let kafkaEventBus: jest.Mocked<KafkaEventBusService>;
  let userCacheRepository: jest.Mocked<UserCacheRepository>;
  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };
    nestjsEventBus = { publish: jest.fn() } as any;
    kafkaEventBus = { publish: jest.fn() } as any;
    handler = new UpdateUserCommandHandler(
      userRepository,
      userCacheRepository,
      nestjsEventBus,
      kafkaEventBus,
    );
  });

  it('should update, save user and publish events in both event buses', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const user = new User({
      id: new UserIdValueObject(userId),
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
    const updatedUser = {
      ...user,
      update: jest.fn(),
      pullDomainEvents: jest.fn(),
    } as unknown as User;
    const domainEvent = new UserUpdatedDomainEvent({
      eventId: 'evt-2',
      aggregateId: userId,
      firstName: 'Alicia',
      lastName: 'Smith',
      bio: 'Gardener',
      avatar: 'https://avatar.com/alice.png',
      occurredAt: user.updatedAt.toISOString(),
    });
    // Simular update y eventos
    (user.update as jest.Mock).mockReturnValue(updatedUser);
    (updatedUser.pullDomainEvents as jest.Mock).mockReturnValue([domainEvent]);
    userRepository.findById.mockResolvedValue(user);

    const command = new UpdateUserCommand(userId, 'Alicia');
    await handler.execute(command);

    expect(user.update).toHaveBeenCalledWith({
      firstName: 'Alicia',
      lastName: undefined,
      avatar: undefined,
      bio: undefined,
    });
    expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
    expect(nestjsEventBus.publish).toHaveBeenCalledWith(domainEvent);
    expect(kafkaEventBus.publish).toHaveBeenCalledWith(domainEvent);
  });

  it('should throw UserNotFoundException if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);
    const command = new UpdateUserCommand('not-found-id', 'Alicia');
    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
  });
});
