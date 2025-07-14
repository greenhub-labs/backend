import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { CreateFarmCommand } from './create-farm.command';
import {
  FarmsRepositoryPort,
  FARMS_REPOSITORY_TOKEN,
} from '../../ports/farms.repository';
import { EventBusServicePort } from '../../ports/event-bus.service';
import { FarmsFactory } from '../../../domain/factories/farm.factory';
import {
  FARMS_CACHE_REPOSITORY_TOKEN,
  FarmsCacheRepository,
} from '../../ports/farms-cache.repository';

/**
 * Command handler for CreateFarmCommand
 */
@CommandHandler(CreateFarmCommand)
export class CreateFarmCommandHandler
  implements ICommandHandler<CreateFarmCommand>
{
  private readonly logger = new Logger(CreateFarmCommandHandler.name);
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepositoryPort,
    @Inject(FARMS_CACHE_REPOSITORY_TOKEN)
    private readonly farmsCacheRepository: FarmsCacheRepository,
    private readonly eventBus: EventBusServicePort,
    private readonly farmsFactory: FarmsFactory,
  ) {}

  /**
   * Handles the CreateFarmCommand
   * @param command - The command to handle
   */
  async execute(command: CreateFarmCommand): Promise<void> {
    this.logger.debug('Executing create farm command');
    this.logger.debug(JSON.stringify(command));

    const farm = this.farmsFactory.create({
      name: command.name,
      description: command.description,
      country: command.country,
      state: command.state,
      city: command.city,
      postalCode: command.postalCode,
      street: command.street,
      latitude: command.latitude,
      longitude: command.longitude,
      isActive: command.isActive,
    });

    await this.farmsRepository.save(farm);

    await this.farmsCacheRepository.set(farm.id.value, farm);

    for (const event of farm.pullDomainEvents()) {
      await this.eventBus.publish(event);
    }
  }
}
