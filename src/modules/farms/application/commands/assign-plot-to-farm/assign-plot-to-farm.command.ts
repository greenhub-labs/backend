/**
 * Command to assign an existing plot to a farm.
 * @remarks
 * This command coordinates the assignment of a plot to a farm aggregate.
 */
export class AssignPlotToFarmCommand {
  /** Farm identifier */
  readonly farmId: string;
  /** Plot identifier */
  readonly plotId: string;

  /**
   * Creates a new AssignPlotToFarmCommand
   * @param farmId - Farm identifier
   * @param plotId - Plot identifier
   */
  constructor(farmId: string, plotId: string) {
    this.farmId = farmId;
    this.plotId = plotId;
  }
}
