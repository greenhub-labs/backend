import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CropEntity } from '../../../domain/entities/crop.entity';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from '../../ports/crops.repository';
import { UnassignCropVarietyCommand } from './unassign-crop-variety.command';

@CommandHandler(UnassignCropVarietyCommand)
export class UnassignCropVarietyCommandHandler
  implements ICommandHandler<UnassignCropVarietyCommand>
{
  constructor(
    @Inject(CROPS_REPOSITORY_TOKEN)
    private readonly cropsRepository: CropsRepository,
  ) {}

  async execute(command: UnassignCropVarietyCommand): Promise<CropEntity> {
    const crop = await this.cropsRepository.findById(command.cropId);
    if (!crop) {
      throw new Error(`Crop with id ${command.cropId} not found`);
    }
    const updatedCrop = crop.update({ varietyId: undefined });
    await this.cropsRepository.update(updatedCrop);
    return updatedCrop;
  }
}
