import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import {
  CROPS_CACHE_REPOSITORY_TOKEN,
  CropsCacheRepository,
} from '../../ports/crops-cache.repository';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { DeleteCropCommand } from './delete-crop.command';

/**
 * Command handler for DeleteCropCommand
 */
@CommandHandler(DeleteCropCommand)
export class DeleteCropCommandHandler
  implements ICommandHandler<DeleteCropCommand>
{
  constructor(
    @Inject(CROPS_REPOSITORY_TOKEN)
    private readonly cropsRepository: CropsRepository,
    @Inject(CROPS_CACHE_REPOSITORY_TOKEN)
    private readonly cropsCacheRepository: CropsCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
  ) {}

  /**
   * Handles the DeleteCropCommand
   * @param command - The command to handle
   */
  async execute(command: DeleteCropCommand): Promise<boolean> {
    // 1. Find the crop by ID
    const crop = await this.cropsRepository.findById(command.cropId);
    if (!crop) {
      throw new CropNotFoundException(command.cropId);
    }
    // 2. Mark as deleted (soft delete) and persist
    const deletedCrop = crop.delete();
    await this.cropsRepository.update(deletedCrop);
    // 3. Remove from cache
    await this.cropsCacheRepository.remove(deletedCrop.id.value);
    // 4. Publish domain events
    for (const event of deletedCrop.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
    }
    return true;
  }
}
