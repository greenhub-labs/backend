import { RestoreUserCommandHandler } from './restore-user.command-handler';
import { RestoreUserCommand } from './restore-user.command';
import { UserRepository } from '../../ports/user.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';
import { User } from '../../../domain/entities/user.entity';
import { UserIdValueObject } from '../../../domain/value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../../../domain/value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../../domain/value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserRestoredDomainEvent } from '../../../domain/events/user-restored/user-restored.domain-event';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';
import { UserCacheRepository } from '../../ports/user-cache.repository';

describe('RestoreUserCommandHandler', () => {
  let handler: RestoreUserCommandHandler;
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
    handler = new RestoreUserCommandHandler(
      userRepository,
      userCacheRepository,
      nestjsEventBus,
      kafkaEventBus,
    );
  });

  it('should restore, save user and publish events in both event buses', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const user = new User({
      id: new UserIdValueObject(userId),
      firstName: new UserNameValueObject('Alice'),
      lastName: new UserNameValueObject('Smith'),
      avatar: new UserAvatarUrlValueObject('https://avatar.com/alice.png'),
      bio: 'Gardener',
      isActive: true,
      isDeleted: true,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      emitEvent: false,
    });
    const restoredUser = {
      ...user,
      restore: jest.fn(),
      pullDomainEvents: jest.fn(),
    } as unknown as User;
    const domainEvent = new UserRestoredDomainEvent({
      eventId: 'evt-restore-3',
      aggregateId: userId,
      occurredAt: user.updatedAt.toISOString(),
    });
    // Simular restore y eventos
    (user.restore as jest.Mock).mockReturnValue(restoredUser);
    (restoredUser.pullDomainEvents as jest.Mock).mockReturnValue([domainEvent]);
    userRepository.findById.mockResolvedValue(user);

    const command = new RestoreUserCommand(userId);
    await handler.execute(command);

    expect(user.restore).toHaveBeenCalled();
    expect(userRepository.save).toHaveBeenCalledWith(restoredUser);
    expect(nestjsEventBus.publish).toHaveBeenCalledWith(domainEvent);
    expect(kafkaEventBus.publish).toHaveBeenCalledWith(domainEvent);
  });

  it('should throw UserNotFoundException if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);
    const command = new RestoreUserCommand('not-found-id');
    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
  });
});
