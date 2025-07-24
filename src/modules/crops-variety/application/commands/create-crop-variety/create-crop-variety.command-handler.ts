import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SEASON } from 'src/shared/domain/constants/season.constant';
import { CropVarietyEntity } from '../../../domain/entities/crop-variety.entity';
import { CropVarietyFactory } from '../../../domain/factories/crop-variety.factory';
import {
  CROP_VARIETY_CACHE_REPOSITORY_TOKEN,
  CropVarietyCacheRepository,
} from '../../ports/crop-variety-cache.repository';
import {
  CROP_VARIETY_REPOSITORY_TOKEN,
  CropVarietyRepository,
} from '../../ports/crop-variety.repository';
import { NestjsEventBusService } from '../../services/nestjs-event-bus.service';
import { CreateCropVarietyCommand } from './create-crop-variety.command';

@CommandHandler(CreateCropVarietyCommand)
export class CreateCropVarietyCommandHandler
  implements ICommandHandler<CreateCropVarietyCommand>
{
  private readonly logger = new Logger(CreateCropVarietyCommandHandler.name);
  constructor(
    @Inject(CROP_VARIETY_CACHE_REPOSITORY_TOKEN)
    private readonly cropVarietyCacheRepository: CropVarietyCacheRepository,
    @Inject(CROP_VARIETY_REPOSITORY_TOKEN)
    private readonly cropVarietyRepository: CropVarietyRepository,
    private readonly cropVarietyFactory: CropVarietyFactory,
    private readonly nestjsEventBus: NestjsEventBusService,
  ) {}

  async execute(command: CreateCropVarietyCommand): Promise<CropVarietyEntity> {
    this.logger.debug('Executing create crop variety command');
    this.logger.debug(JSON.stringify(command));

    // 1. Create the crop variety
    const cropVariety: CropVarietyEntity = this.cropVarietyFactory.create({
      name: command.name,
      scientificName: command.scientificName,
      type: command.type,
      description: command.description,
      averageYield: command.averageYield,
      daysToMaturity: command.daysToMaturity,
      plantingDepth: command.plantingDepth,
      spacingBetween: command.spacingBetween,
      waterRequirements: command.waterRequirements,
      sunRequirements: command.sunRequirements,
      minIdealTemperature: command.minIdealTemperature,
      maxIdealTemperature: command.maxIdealTemperature,
      minIdealPh: command.minIdealPh,
      maxIdealPh: command.maxIdealPh,
      compatibleWith: command.compatibleWith,
      incompatibleWith: command.incompatibleWith,
      plantingSeasons: command.plantingSeasons as SEASON[],
      harvestSeasons: command.harvestSeasons as SEASON[],
    });

    // 2. Save the crop variety
    await this.cropVarietyRepository.save(cropVariety);

    // 3. Cache the crop variety
    await this.cropVarietyCacheRepository.set(
      cropVariety.id.value,
      cropVariety,
    );

    // 4. Publish domain events
    for (const event of cropVariety.pullDomainEvents()) {
      await this.nestjsEventBus.publish(event);
    }

    return cropVariety;
  }
}
