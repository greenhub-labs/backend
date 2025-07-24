import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { AssignCropVarietyCommand } from 'src/modules/crops/application/commands/assign-crop-variety/assign-crop-variety.command';
import { CropDetailsResult } from 'src/modules/crops/application/dtos/crop-details.result';
import {
  CROPS_REPOSITORY_TOKEN,
  CropsRepository,
} from 'src/modules/crops/application/ports/crops.repository';
import { GetCropVarietyByIdQuery } from '../../queries/get-crop-variety-by-id/get-crop-variety-by-id.query';

@CommandHandler(AssignCropVarietyCommand)
export class AssignCropVarietyCommandHandler
  implements ICommandHandler<AssignCropVarietyCommand>
{
  constructor(
    @Inject(CROPS_REPOSITORY_TOKEN)
    private readonly cropsRepository: CropsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: AssignCropVarietyCommand): Promise<CropDetailsResult> {
    const crop = await this.cropsRepository.findById(command.cropId);
    if (!crop) {
      throw new Error(`Crop with id ${command.cropId} not found`);
    }
    const cropVariety = await this.queryBus.execute(
      new GetCropVarietyByIdQuery(command.cropVarietyId),
    );

    const updatedCrop = crop.update({ varietyId: cropVariety.id });
    await this.cropsRepository.update(updatedCrop);
    return new CropDetailsResult(updatedCrop, cropVariety);
  }
}
