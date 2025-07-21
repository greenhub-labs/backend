import { CropEntity } from '../../../domain/entities/crop.entity';
import { CropResponseDto } from '../dtos/responses/crop.response.dto';

export class CropMapper {
  static fromDomain(entity: CropEntity): CropResponseDto {
    return {
      id: entity.id.value,
      plotId: entity.plotId,
      varietyId: entity.varietyId,
      plantingDate: entity.plantingDate?.toISOString(),
      expectedHarvest: entity.expectedHarvest?.toISOString(),
      actualHarvest: entity.actualHarvest?.toISOString(),
      quantity: entity.quantity,
      status: entity.status?.value,
      plantingMethod: entity.plantingMethod?.value,
      notes: entity.notes,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
