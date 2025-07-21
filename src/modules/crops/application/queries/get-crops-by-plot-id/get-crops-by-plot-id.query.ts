import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get crops by plot ID.
 */
export class GetCropsByPlotIdQuery implements IQuery {
  /** Plot unique identifier */
  readonly plotId: string;

  /**
   * Creates a new GetCropsByPlotIdQuery
   * @param plotId - The unique identifier of the plot
   */
  constructor(plotId: string) {
    this.plotId = plotId;
  }
}
