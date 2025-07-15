import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateFarmCommand } from './update-farm.command';
import {
  FarmsRepository,
  FARMS_REPOSITORY_TOKEN,
} from '../../ports/farms.repository';
import {
  FARMS_CACHE_REPOSITORY_TOKEN,
  FarmsCacheRepository,
} from '../../ports/farms-cache.repository';
import { EventBus } from '../../ports/event-bus.service';
import { FarmNotFoundException } from '../../../domain/exceptions/farm-not-found/farm-not-found.exception';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { FarmEntity } from 'src/modules/farms/domain/entities/farm.entity';
import { FarmMembershipsRepository } from '../../ports/farm-memberships.repository';
import { FarmDetailsResult } from '../../dtos/farm-details.result';

/**
 * Command handler for UpdateFarmCommand
 */
@CommandHandler(UpdateFarmCommand)
export class UpdateFarmCommandHandler
  implements ICommandHandler<UpdateFarmCommand>
{
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepository,
    @Inject(FARMS_CACHE_REPOSITORY_TOKEN)
    private readonly farmsCacheRepository: FarmsCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    @Inject('FARM_MEMBERSHIPS_REPOSITORY_TOKEN')
    private readonly farmMembershipsRepository: FarmMembershipsRepository,
  ) {}

  /**
   * Handles the UpdateFarmCommand
   * @param command - The command to handle
   */
  async execute(command: UpdateFarmCommand): Promise<FarmDetailsResult> {
    // 1. Find the farm by ID
    const farm = await this.farmsRepository.findById(command.id);
    if (!farm) {
      throw new FarmNotFoundException();
    }
    // 2. Update the farm entity
    const updatedFarm = farm.update({
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
    // 3. Persist the updated farm
    await this.farmsRepository.update(updatedFarm);
    // 4. Update the cache
    await this.farmsCacheRepository.set(updatedFarm.id.value, updatedFarm);
    // 5. Publish domain events
    for (const event of updatedFarm.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
    }
    // 6. Obtener los miembros actuales de la farm
    const members = await this.farmMembershipsRepository.getUsersByFarmId(
      updatedFarm.id.value,
    );
    return new FarmDetailsResult(updatedFarm, members);
  }
}
