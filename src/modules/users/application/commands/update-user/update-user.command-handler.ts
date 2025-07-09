import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { UserRepository } from '../../ports/user.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { KafkaEventBusService } from '../../services/kafka-event-bus.service';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found/user-not-found.exception';

/**
 * Command handler for updating a user
 * Publishes events to both NestJS CQRS and Kafka event bus
 */
@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly kafkaEventBus: KafkaEventBusService,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    // 1. Find the user
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new UserNotFoundException(command.id);
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

    // 4. Publish domain events to both event buses
    const events = updatedUser.pullDomainEvents();
    for (const event of events) {
      await this.nestjsEventBus.publish(event);
      await this.kafkaEventBus.publish(event);
    }
  }
}
