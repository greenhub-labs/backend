import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
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
 * Command handler for deleting (soft delete) a user
 * Publishes events to both NestJS CQRS and Kafka event bus
 * Removes user from cache after deletion
 */
@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(USER_CACHE_REPOSITORY_TOKEN)
    private readonly userCacheRepository: UserCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly kafkaEventBus: KafkaEventBusService,
  ) {}

  async execute(command: DeleteUserCommand): Promise<User> {
    // 1. Find the user (check cache first, then database)
    let user = await this.userCacheRepository.get(command.id);
    if (!user) {
      user = await this.userRepository.findById(command.id);
      if (!user) {
        throw new UserNotFoundException(command.id);
      }
    }

    // 2. Delete the user (returns a new instance)
    const deletedUser = user.delete();

    // 3. Save the deleted user
    await this.userRepository.save(deletedUser);

    // 4. Remove user from cache since it's deleted
    await this.userCacheRepository.delete(command.id);

    // 5. Publish domain events to both event buses
    const events = deletedUser.pullDomainEvents();
    for (const event of events) {
      await this.nestjsEventBus.publish(event);
      await this.kafkaEventBus.publish(event);
    }

    // Return the deleted user entity (DDD strict)
    return deletedUser;
  }
}
