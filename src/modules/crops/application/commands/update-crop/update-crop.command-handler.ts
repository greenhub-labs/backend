import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { CropNotFoundException } from '../../../domain/exceptions/crop-not-found/crop-not-found.exception';
import { CropDetailsResult } from '../../dtos/crop-details.result';
import {
  CROPS_CACHE_REPOSITORY_TOKEN,
  CropsCacheRepository,
} from '../../ports/crops-cache.repository';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { GetCropVarietyByIdQuery } from '../../queries/get-crop-variety-by-id/get-crop-variety-by-id.query';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { UpdateCropCommand } from './update-crop.command';

/**
 * Command handler for UpdateCropCommand
 */
@CommandHandler(UpdateCropCommand)
export class UpdateCropCommandHandler
  implements ICommandHandler<UpdateCropCommand>
{
  private readonly logger = new Logger(UpdateCropCommandHandler.name);
  constructor(
    @Inject(CROPS_REPOSITORY_TOKEN)
    private readonly cropsRepository: CropsRepository,
    @Inject(CROPS_CACHE_REPOSITORY_TOKEN)
    private readonly cropsCacheRepository: CropsCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the UpdateCropCommand
   * @param command - The command to handle
   */
  async execute(command: UpdateCropCommand): Promise<CropDetailsResult> {
    this.logger.debug('Executing update crop command');
    this.logger.debug(JSON.stringify(command));

    // 1. Find the crop by ID
    const crop = await this.cropsRepository.findById(command.id);

    if (!crop) {
      throw new CropNotFoundException();
    }
    // 2. Update the crop entity
    const updatedCrop = crop.update({
      plantingDate: command.plantingDate,
      expectedHarvest: command.expectedHarvest,
      actualHarvest: command.actualHarvest,
      quantity: command.quantity,
      status: command.status,
      plantingMethod: command.plantingMethod,
      notes: command.notes,
    });

    // 3. Persist the updated crop
    await this.cropsRepository.update(updatedCrop);

    // 4. Update the cache
    await this.cropsCacheRepository.set(updatedCrop.id.value, updatedCrop);

    // 5. Get the crop variety
    const cropVariety = await this.queryBus.execute(
      new GetCropVarietyByIdQuery(updatedCrop.varietyId),
    );

    // 6. Publish domain events
    for (const event of updatedCrop.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
    }

    return new CropDetailsResult(updatedCrop, cropVariety);
  }
}
