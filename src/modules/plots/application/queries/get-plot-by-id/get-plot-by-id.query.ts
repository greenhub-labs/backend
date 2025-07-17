import { IQuery } from '@nestjs/cqrs';

/**
 * Query to get a plot by its ID.
 */
export class GetPlotByIdQuery implements IQuery {
  /** Plot unique identifier */
  readonly plotId: string;

  /**
   * Creates a new GetPlotByIdQuery
   * @param plotId - The unique identifier of the plot
   */
  constructor(plotId: string) {
    this.plotId = plotId;
  }
}
