import { CropVarietyEntity } from '../../../domain/entities/crop-variety.entity';
import { CropVarietyResponseDto } from '../dtos/responses/crop-variety.response.dto';

export class CropVarietyMapper {
  static fromDomain(entity: CropVarietyEntity): CropVarietyResponseDto {
    return {
      id: entity['_id'].value,
      name: entity['_name'],
      scientificName: entity['_scientificName'],
      type: entity['_type'].value,
      description: entity['_description'],
      averageYield: entity['_averageYield'],
      daysToMaturity: entity['_daysToMaturity'],
      plantingDepth: entity['_plantingDepth'],
      spacingBetween: entity['_spacingBetween'],
      waterRequirements: entity.waterRequirements?.value,
      sunRequirements: entity.sunRequirements?.value,
      minIdealTemperature: entity['_minIdealTemperature'],
      maxIdealTemperature: entity['_maxIdealTemperature'],
      minIdealPh: entity['_minIdealPh'],
      maxIdealPh: entity['_maxIdealPh'],
      compatibleWith: entity['_compatibleWith'],
      incompatibleWith: entity['_incompatibleWith'],
      plantingSeasons: entity['_plantingSeasons'].map((s) => s.value),
      harvestSeasons: entity['_harvestSeasons'].map((s) => s.value),
      createdAt: entity['_createdAt']?.toISOString(),
      updatedAt: entity['_updatedAt']?.toISOString(),
      deletedAt: entity['_deletedAt']?.toISOString(),
    };
  }
}
