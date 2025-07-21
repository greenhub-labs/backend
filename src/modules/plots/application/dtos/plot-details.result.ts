import { CropEntity } from 'src/modules/crops/domain/entities/crop.entity';
import { PlotEntity } from '../../domain/entities/plot.entity';

/**
 * Aggregated result for plot details, including crops and extensible for future fields.
 */
export class PlotDetailsResult {
  constructor(
    public readonly plot: PlotEntity,
    public readonly crops: CropEntity[] = [],
    // Future: plots, configuration, sensors, etc.
  ) {}
}
