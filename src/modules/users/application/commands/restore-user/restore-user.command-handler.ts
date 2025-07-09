import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RestoreUserCommand } from './restore-user.command';
import { UserRepository } from '../../ports/user.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';
import { UserRestoredDomainEvent } from '../../../domain/events/user-restored/user-restored.domain-event';

/**
 * Command handler to restore a previously deleted user (soft restore).
 *
 * @remarks
 * Restores the user, saves the changes, and publishes the corresponding domain event.
 */
@CommandHandler(RestoreUserCommand)
@Injectable()
export class RestoreUserCommandHandler
  implements ICommandHandler<RestoreUserCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly kafkaEventBus: KafkaEventBusService,
  ) {}

  async execute(command: RestoreUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new UserNotFoundException(command.userId);
    }
    const restoredUser = user.restore();
    await this.userRepository.save(restoredUser);
    for (const event of restoredUser.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
      await this.kafkaEventBus.publish(event);
    }
  }
}
