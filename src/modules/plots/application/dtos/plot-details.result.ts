import { PlotEntity } from '../../domain/entities/plot.entity';

/**
 * Aggregated result for farm details, including members and extensible for future fields.
 */
export class PlotDetailsResult {
  constructor(
    public readonly plot: PlotEntity,
    // Future: plots, configuration, sensors, etc.
  ) {}
}
