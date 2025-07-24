import { CropVarietyEntity } from 'src/modules/crops-variety/domain/entities/crop-variety.entity';
import { CropEntity } from '../../domain/entities/crop.entity';

/**
 * Aggregated result for farm details, including members and extensible for future fields.
 */
export class CropDetailsResult {
  constructor(
    public readonly crop: CropEntity,
    public readonly cropVariety: CropVarietyEntity,
    // Future: crops, configuration, sensors, etc.
  ) {}
}
