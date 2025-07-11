import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { Inject } from '@nestjs/common';
import {
  UserRepository,
  USER_REPOSITORY_TOKEN,
} from '../../ports/user.repository';
import {
  UserCacheRepository,
  USER_CACHE_REPOSITORY_TOKEN,
} from '../../ports/user-cache.repository';
import { User } from '../../../domain/entities/user.entity';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';

/**
 * Command handler for updating a user
 * Publishes events to both NestJS CQRS and Kafka event bus
 * Updates cache with the modified user data
 */
@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(USER_CACHE_REPOSITORY_TOKEN)
    private readonly userCacheRepository: UserCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly kafkaEventBus: KafkaEventBusService,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    // 1. Find the user (check cache first, then database)
    let user = await this.userCacheRepository.get(command.id);
    if (!user) {
      user = await this.userRepository.findById(command.id);
      if (!user) {
        throw new UserNotFoundException(command.id);
      }
    }

    // 2. Update the user (returns a new instance)
    const updatedUser = user.update({
      firstName: command.firstName,
      lastName: command.lastName,
      avatar: command.avatar,
      bio: command.bio,
    });

    // 3. Save the updated user
    await this.userRepository.save(updatedUser);

    // 4. Update the cache with the new user data
    await this.userCacheRepository.set(updatedUser.id.value, updatedUser);

    // 5. Publish domain events to both event buses
    const events = updatedUser.pullDomainEvents();
    for (const event of events) {
      await this.nestjsEventBus.publish(event);
      await this.kafkaEventBus.publish(event);
    }

    // Return the updated user entity (DDD strict)
    return updatedUser;
  }
}
