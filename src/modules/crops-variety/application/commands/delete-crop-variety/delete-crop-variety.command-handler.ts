import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CROP_VARIETY_REPOSITORY_TOKEN,
  CropVarietyRepository,
} from '../../ports/crop-variety.repository';
import { DeleteCropVarietyCommand } from './delete-crop-variety.command';

@CommandHandler(DeleteCropVarietyCommand)
export class DeleteCropVarietyCommandHandler
  implements ICommandHandler<DeleteCropVarietyCommand>
{
  constructor(
    @Inject(CROP_VARIETY_REPOSITORY_TOKEN)
    private readonly cropVarietyRepository: CropVarietyRepository,
  ) {}

  async execute(command: DeleteCropVarietyCommand): Promise<boolean> {
    const cropVariety = await this.cropVarietyRepository.findById(command.id);
    if (!cropVariety) {
      throw new Error(`CropVariety with id ${command.id} not found`);
    }
    const deleted = cropVariety.delete();
    await this.cropVarietyRepository.update(deleted);
    return true;
  }
}
