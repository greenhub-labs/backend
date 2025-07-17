import { ICommand } from '@nestjs/cqrs';

/**
 * Command to delete a plot by its ID.
 * @remarks
 * This command triggers the deletion of a plot aggregate.
 */
export class DeletePlotCommand implements ICommand {
  /** Plot unique identifier */
  readonly plotId: string;

  /**
   * Creates a new DeletePlotCommand
   * @param plotId - The unique identifier of the plot to delete
   */
  constructor(plotId: string) {
    this.plotId = plotId;
  }
}
