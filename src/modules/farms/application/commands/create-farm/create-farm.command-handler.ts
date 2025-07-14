import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { CreateFarmCommand } from './create-farm.command';
import {
  FarmsRepository,
  FARMS_REPOSITORY_TOKEN,
} from '../../ports/farms.repository';
import { EventBus } from '../../ports/event-bus.service';
import { FarmFactory } from '../../../domain/factories/farm.factory';
import {
  FARMS_CACHE_REPOSITORY_TOKEN,
  FarmsCacheRepository,
} from '../../ports/farms-cache.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';

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
    private readonly farmsRepository: FarmsRepository,
    @Inject(FARMS_CACHE_REPOSITORY_TOKEN)
    private readonly farmsCacheRepository: FarmsCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly farmFactory: FarmFactory,
  ) {}

  /**
   * Handles the CreateFarmCommand
   * @param command - The command to handle
   */
  async execute(command: CreateFarmCommand): Promise<void> {
    this.logger.debug('Executing create farm command');
    this.logger.debug(JSON.stringify(command));

    const farm = this.farmFactory.create({
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
      await this.nestjsEventBus.publish(event);
    }
  }
}
