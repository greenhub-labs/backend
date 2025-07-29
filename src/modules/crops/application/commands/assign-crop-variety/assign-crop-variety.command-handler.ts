import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GetCropVarietyByIdQuery } from 'src/modules/crops-variety/application/queries/get-crop-variety-by-id/get-crop-variety-by-id.query';
import { CropDetailsResult } from '../../dtos/crop-details.result';
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
