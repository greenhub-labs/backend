import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CropVarietyEntity } from '../../../domain/entities/crop-variety.entity';
import {
  CROP_VARIETY_REPOSITORY_TOKEN,
  CropVarietyRepository,
} from '../../ports/crop-variety.repository';
import { UpdateCropVarietyCommand } from './update-crop-variety.command';

@CommandHandler(UpdateCropVarietyCommand)
export class UpdateCropVarietyCommandHandler
  implements ICommandHandler<UpdateCropVarietyCommand>
{
  constructor(
    @Inject(CROP_VARIETY_REPOSITORY_TOKEN)
    private readonly cropVarietyRepository: CropVarietyRepository,
  ) {}

  async execute(command: UpdateCropVarietyCommand): Promise<CropVarietyEntity> {
    const cropVariety = await this.cropVarietyRepository.findById(command.id);
    if (!cropVariety) {
      throw new Error(`CropVariety with id ${command.id} not found`);
    }
    const updated = cropVariety.update({
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
      plantingSeasons: command.plantingSeasons as any,
      harvestSeasons: command.harvestSeasons as any,
    });
    await this.cropVarietyRepository.update(updated);
    return updated;
  }
}
