import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RestoreUserCommand } from './restore-user.command';
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
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';
import { UserRestoredDomainEvent } from '../../../domain/events/user-restored/user-restored.domain-event';
import { User } from '../../../domain/entities/user.entity';

/**
 * Command handler to restore a previously deleted user (soft restore).
 *
 * @remarks
 * Restores the user, saves the changes, publishes the corresponding domain event,
 * and caches the restored user.
 */
@CommandHandler(RestoreUserCommand)
@Injectable()
export class RestoreUserCommandHandler
  implements ICommandHandler<RestoreUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(USER_CACHE_REPOSITORY_TOKEN)
    private readonly userCacheRepository: UserCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly kafkaEventBus: KafkaEventBusService,
  ) {}

  async execute(command: RestoreUserCommand): Promise<User> {
    // 1. Find the user (check database for deleted users)
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new UserNotFoundException(command.userId);
    }

    // 2. Restore the user
    const restoredUser = user.restore();

    // 3. Save the restored user
    await this.userRepository.save(restoredUser);

    // 4. Cache the restored user
    await this.userCacheRepository.set(restoredUser.id.value, restoredUser);

    // 5. Publish domain events
    for (const event of restoredUser.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
      await this.kafkaEventBus.publish(event);
    }

    // Return the restored user entity (DDD strict)
    return restoredUser;
  }
}
