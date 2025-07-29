import { CropDetailsResult } from '../../../crops/application/dtos/crop-details.result';
import { PlotEntity } from '../../domain/entities/plot.entity';

/**
 * Aggregated result for plot details, including crops and extensible for future fields.
 */
export class PlotDetailsResult {
  constructor(
    public readonly plot: PlotEntity,
    public readonly crops: CropDetailsResult[] = [],
    // Future: plots, configuration, sensors, etc.
  ) {}
}
