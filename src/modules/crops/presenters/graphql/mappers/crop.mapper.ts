import { CropDetailsResult } from 'src/modules/crops/application/dtos/crop-details.result';
import { CropEntity } from 'src/modules/crops/domain/entities/crop.entity';
import { CropResponseDto } from '../dtos/responses/crop.response.dto';

export class CropMapper {
  static fromDomain(entity: CropDetailsResult): CropResponseDto {
    const { crop } = entity;
    return CropMapper.fromEntity(crop);
  }

  static fromEntity(crop: CropEntity): CropResponseDto {
    return {
      id: crop.id.value,
      plotId: crop.plotId,
      varietyId: crop.varietyId,
      plantingDate: crop.plantingDate?.toISOString(),
      expectedHarvest: crop.expectedHarvest?.toISOString(),
      actualHarvest: crop.actualHarvest?.toISOString(),
      quantity: crop.quantity,
      status: crop.status?.value,
      plantingMethod: crop.plantingMethod?.value,
      notes: crop.notes,
      createdAt: crop.createdAt?.toISOString(),
      updatedAt: crop.updatedAt?.toISOString(),
      deletedAt: crop.deletedAt?.toISOString(),
    };
  }
}
