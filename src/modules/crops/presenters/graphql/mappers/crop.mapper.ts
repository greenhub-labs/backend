import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import { CropVarietyMapper } from 'src/modules/crops-variety/presenters/graphql/mappers/crop-variety.mapper';
import { CropEntity } from 'src/modules/crops/domain/entities/crop.entity';
import { CropResponseDto } from '../dtos/responses/crop.response.dto';

export class CropMapper {
  static fromDomain(entity: {
    crop: CropEntity;
    cropVariety: CropVarietyEntity;
  }): CropResponseDto {
    const { crop, cropVariety } = entity;

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
      cropVariety: cropVariety
        ? CropVarietyMapper.fromDomain(cropVariety)
        : undefined,
    };
  }

  static fromEntity(
    crop: CropEntity,
    cropVariety?: CropVarietyEntity,
  ): CropResponseDto {
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
      cropVariety: cropVariety
        ? CropVarietyMapper.fromDomain(cropVariety)
        : undefined,
    };
  }
}
