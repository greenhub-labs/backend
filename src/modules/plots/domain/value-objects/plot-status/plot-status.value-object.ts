import { PLOT_STATUS } from '../../constants/plot-status.constant';
import { InvalidPlotStatusException } from '../../exceptions/invalid-plot-status/invalid-plot-status.exception';

/**
 * Value Object representing the name of a Plot.
 *
 * @property name - The name of the plot
 */

export class PlotStatusValueObject {
  public readonly value: string;
  /**
   * Creates a new PlotNameValueObject
   * @param props - The name properties
   */
  constructor(value: string) {
    this.value = value;
    this.validate();
  }

  /**
   * Validates the name value object
   */
  protected validate(): void {
    const value = this.value;
    if (!value || value.trim().length === 0) {
      throw new InvalidPlotStatusException('Plot status must not be empty.');
    }
    if (!Object.values(PLOT_STATUS).includes(value as PLOT_STATUS)) {
      throw new InvalidPlotStatusException('Invalid plot status.');
    }
  }
}
