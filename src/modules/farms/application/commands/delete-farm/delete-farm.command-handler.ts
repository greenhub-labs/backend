import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteFarmCommand } from './delete-farm.command';
import {
  FARMS_REPOSITORY_TOKEN,
  FarmsRepository,
} from '../../ports/farms.repository';
import {
  FARMS_CACHE_REPOSITORY_TOKEN,
  FarmsCacheRepository,
} from '../../ports/farms-cache.repository';
import { EventBusServicePort } from '../../ports/event-bus.service';
import { FarmNotFoundException } from '../../../domain/exceptions/farm-not-found/farm-not-found.exception';

/**
 * Command handler for DeleteFarmCommand
 */
@CommandHandler(DeleteFarmCommand)
export class DeleteFarmCommandHandler
  implements ICommandHandler<DeleteFarmCommand>
{
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepository,
    @Inject(FARMS_CACHE_REPOSITORY_TOKEN)
    private readonly farmsCacheRepository: FarmsCacheRepository,
    private readonly eventBus: EventBusServicePort,
  ) {}

  /**
   * Handles the DeleteFarmCommand
   * @param command - The command to handle
   */
  async execute(command: DeleteFarmCommand): Promise<void> {
    // 1. Find the farm by ID
    const farm = await this.farmsRepository.findById(command.farmId);
    if (!farm) {
      throw new FarmNotFoundException(command.farmId);
    }
    // 2. Mark as deleted (soft delete) and persist
    const deletedFarm = farm.delete();
    await this.farmsRepository.update(deletedFarm);
    // 3. Remove from cache
    await this.farmsCacheRepository.remove(deletedFarm.id.value);
    // 4. Publish domain events
    for (const event of deletedFarm.pullDomainEvents()) {
      await this.eventBus.publish(event);
    }
  }
}
