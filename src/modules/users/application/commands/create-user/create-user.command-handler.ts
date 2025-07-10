import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { UserFactory } from '../../../domain/factories/user/user.factory';
import {
  UserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../ports/user.repository';
import {
  UserCacheRepository,
  USER_CACHE_REPOSITORY_TOKEN,
} from '../../ports/user-cache.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';
import { User } from '../../../domain/entities/user.entity';

/**
 * Command handler for creating a new user
 * Publishes events to both NestJS CQRS and Kafka event bus
 * Caches the created user for improved performance
 */
@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private readonly userFactory: UserFactory,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(USER_CACHE_REPOSITORY_TOKEN)
    private readonly userCacheRepository: UserCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly kafkaEventBus: KafkaEventBusService,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    // 1. Create the user using the factory
    const user = this.userFactory.create({
      firstName: command.firstName,
      lastName: command.lastName,
      avatar: command.avatar,
      bio: command.bio,
    });

    // 2. Save the user in the repository
    await this.userRepository.save(user);

    // 3. Cache the newly created user
    await this.userCacheRepository.set(user.id.value, user);

    // 4. Publish domain events to both event buses
    const events = user.pullDomainEvents();
    for (const event of events) {
      await this.nestjsEventBus.publish(event);
      await this.kafkaEventBus.publish(event);
    }

    // 5. Return the created user entity (DDD strict)
    return user;
  }
}
