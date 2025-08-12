import { CropVarietyEntity } from '../../../domain/entities/crop-variety.entity';
import { CropVarietyResponseDto } from '../dtos/responses/crop-variety.response.dto';

export class CropVarietyMapper {
  static fromDomain(entity: CropVarietyEntity): CropVarietyResponseDto {
    return {
      id: entity.id.value,
      name: entity.name,
      scientificName: entity.scientificName,
      type: entity.type.value,
      description: entity.description,
      averageYield: entity.averageYield,
      daysToMaturity: entity.daysToMaturity,
      plantingDepth: entity.plantingDepth,
      spacingBetween: entity.spacingBetween,
      waterRequirements: entity.waterRequirements?.value,
      sunRequirements: entity.sunRequirements?.value,
      minIdealTemperature: entity.minIdealTemperature,
      maxIdealTemperature: entity.maxIdealTemperature,
      minIdealPh: entity.minIdealPh,
      maxIdealPh: entity.maxIdealPh,
      compatibleWith: entity.compatibleWith,
      incompatibleWith: entity.incompatibleWith,
      plantingSeasons: entity.plantingSeasons.map((s) => s.value),
      harvestSeasons: entity.harvestSeasons.map((s) => s.value),
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
      deletedAt: entity.deletedAt?.toISOString(),
    };
  }
}
