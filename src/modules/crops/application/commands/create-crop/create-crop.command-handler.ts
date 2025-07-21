import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { CropFactory } from '../../../domain/factories/crop.factory';
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
import { CreateCropCommand } from './create-crop.command';

/**
 * Command handler for CreateCropCommand
 */
@CommandHandler(CreateCropCommand)
export class CreateCropCommandHandler
  implements ICommandHandler<CreateCropCommand>
{
  private readonly logger = new Logger(CreateCropCommandHandler.name);
  constructor(
    @Inject(CROPS_REPOSITORY_TOKEN)
    private readonly cropsRepository: CropsRepository,
    @Inject(CROPS_CACHE_REPOSITORY_TOKEN)
    private readonly cropsCacheRepository: CropsCacheRepository,
    private readonly nestjsEventBus: NestjsEventBusService,
    private readonly cropFactory: CropFactory,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Handles the CreateCropCommand
   * @param command - The command to handle
   */
  async execute(command: CreateCropCommand): Promise<CropDetailsResult> {
    this.logger.debug('Executing create crop command');
    this.logger.debug(JSON.stringify(command));

    // 1. Create the crop
    const crop = this.cropFactory.create({
      plotId: command.plotId,
      varietyId: command.varietyId,
      plantingDate: command.plantingDate,
      expectedHarvest: command.expectedHarvest,
      actualHarvest: command.actualHarvest,
      quantity: command.quantity,
      status: command.status,
      plantingMethod: command.plantingMethod,
      notes: command.notes,
    });

    await this.cropsRepository.save(crop);
    await this.cropsCacheRepository.set(crop.id.value, crop);

    // 2. Get the crop variety
    const cropVariety = await this.queryBus.execute(
      new GetCropVarietyByIdQuery(command.varietyId),
    );

    // 3. Publish domain events
    for (const event of crop.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
    }

    return new CropDetailsResult(crop, cropVariety);
  }
}
