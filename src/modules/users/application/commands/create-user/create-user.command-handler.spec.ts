import { CreateUserCommandHandler } from './create-user.command-handler';
import { CreateUserCommand } from './create-user.command';
import { UserFactory } from '../../../domain/factories/user/user.factory';
import { UserRepository } from '../../ports/user.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';
import { User } from '../../../domain/entities/user.entity';
import { UserIdValueObject } from '../../../domain/value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../../../domain/value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../../../domain/value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserCreatedDomainEvent } from '../../../domain/events/user-created/user-created.domain-event';

describe('CreateUserCommandHandler', () => {
  let handler: CreateUserCommandHandler;
  let userFactory: jest.Mocked<UserFactory>;
  let userRepository: jest.Mocked<UserRepository>;
  let nestjsEventBus: jest.Mocked<NestjsEventBusService>;
  let kafkaEventBus: jest.Mocked<KafkaEventBusService>;

  beforeEach(() => {
    userFactory = { create: jest.fn() } as any;
    userRepository = { save: jest.fn() } as any;
    nestjsEventBus = { publish: jest.fn() } as any;
    kafkaEventBus = { publish: jest.fn() } as any;
    handler = new CreateUserCommandHandler(
      userFactory,
      userRepository,
      nestjsEventBus,
      kafkaEventBus,
    );
  });

  it('should create, save user and publish events in both event buses, returning the id', async () => {
    const command = new CreateUserCommand(
      'Alice',
      'Smith',
      'https://avatar.com/alice.png',
      'Gardener',
    );
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
    const domainEvent = new UserCreatedDomainEvent({
      eventId: 'evt-1',
      aggregateId: userId,
      firstName: 'Alice',
      lastName: 'Smith',
      bio: 'Gardener',
      avatar: 'https://avatar.com/alice.png',
      occurredAt: user.createdAt.toISOString(),
    });
    // Simular que el usuario tiene un evento acumulado
    jest.spyOn(user, 'pullDomainEvents').mockReturnValue([domainEvent]);
    userFactory.create.mockReturnValue(user);

    const result = await handler.execute(command);

    expect(userFactory.create).toHaveBeenCalledWith({
      firstName: 'Alice',
      lastName: 'Smith',
      avatar: 'https://avatar.com/alice.png',
      bio: 'Gardener',
    });
    expect(userRepository.save).toHaveBeenCalledWith(user);
    expect(nestjsEventBus.publish).toHaveBeenCalledWith(domainEvent);
    expect(kafkaEventBus.publish).toHaveBeenCalledWith(domainEvent);
    expect(result).toBe(userId);
  });
});
