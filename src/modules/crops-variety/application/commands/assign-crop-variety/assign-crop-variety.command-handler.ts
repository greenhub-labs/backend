import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CropDetailsResult } from '../../dtos/crop-variety-details.result';
import {
  CROP_VARIETY_REPOSITORY_TOKEN,
  CropVarietyRepository,
} from '../../ports/crop-variety.repository';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { AssignCropVarietyCommand } from './assign-crop-variety.command';

@CommandHandler(AssignCropVarietyCommand)
export class AssignCropVarietyCommandHandler
  implements ICommandHandler<AssignCropVarietyCommand>
{
  constructor(
    @Inject(CROPS_REPOSITORY_TOKEN)
    private readonly cropsRepository: CropsRepository,
    @Inject(CROP_VARIETY_REPOSITORY_TOKEN)
    private readonly cropVarietyRepository: CropVarietyRepository,
  ) {}

  async execute(command: AssignCropVarietyCommand): Promise<CropDetailsResult> {
    const crop = await this.cropsRepository.findById(command.cropId);
    if (!crop) {
      throw new Error(`Crop with id ${command.cropId} not found`);
    }
    const cropVariety = await this.cropVarietyRepository.findById(
      command.cropVarietyId,
    );
    if (!cropVariety) {
      throw new Error(`CropVariety with id ${command.cropVarietyId} not found`);
    }
    const updatedCrop = crop.update({ varietyId: command.cropVarietyId });
    await this.cropsRepository.update(updatedCrop);
    return new CropDetailsResult(updatedCrop, cropVariety);
  }
}
