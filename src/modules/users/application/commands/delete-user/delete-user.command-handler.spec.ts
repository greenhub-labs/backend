import { DeleteUserCommandHandler } from './delete-user.command-handler';
import { DeleteUserCommand } from './delete-user.command';
import { UserRepository } from '../../ports/user.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';
import { User } from '../../../domain/entities/user.entity';
import { UserIdValueObject } from '../../../domain/value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../../../domain/value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../../domain/value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserDeletedDomainEvent } from '../../../domain/events/user-deleted/user-deleted.domain-event';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';

describe('DeleteUserCommandHandler', () => {
  let handler: DeleteUserCommandHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;
  let kafkaEventBus: jest.Mocked<KafkaEventBusService>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };
    nestjsEventBus = { publish: jest.fn() } as any;
    kafkaEventBus = { publish: jest.fn() } as any;
    handler = new DeleteUserCommandHandler(
      userRepository,
      nestjsEventBus,
      kafkaEventBus,
    );
  });

  it('should delete (soft delete), save user and publish events in both event buses', async () => {
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
    const deletedUser = {
      ...user,
      delete: jest.fn(),
      pullDomainEvents: jest.fn(),
    } as unknown as User;
    const domainEvent = new UserDeletedDomainEvent({
      eventId: 'evt-3',
      aggregateId: userId,
      occurredAt: user.updatedAt.toISOString(),
    });
    // Simular delete y eventos
    (user.delete as jest.Mock).mockReturnValue(deletedUser);
    (deletedUser.pullDomainEvents as jest.Mock).mockReturnValue([domainEvent]);
    userRepository.findById.mockResolvedValue(user);

    const command = new DeleteUserCommand(userId);
    await handler.execute(command);

    expect(user.delete).toHaveBeenCalled();
    expect(userRepository.save).toHaveBeenCalledWith(deletedUser);
    expect(nestjsEventBus.publish).toHaveBeenCalledWith(domainEvent);
    expect(kafkaEventBus.publish).toHaveBeenCalledWith(domainEvent);
  });

  it('should throw UserNotFoundException if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);
    const command = new DeleteUserCommand('not-found-id');
    await expect(handler.execute(command)).rejects.toThrow(
      UserNotFoundException,
    );
  });
});
