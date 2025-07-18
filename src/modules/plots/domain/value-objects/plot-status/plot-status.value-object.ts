import { PLOT_STATUS } from '../../constants/plot-status.constant';
import { InvalidPlotStatusException } from '../../exceptions/invalid-plot-status/invalid-plot-status.exception';

/**
 * Value Object representing the name of a Plot.
 *
 * @property name - The name of the plot
 */

export class PlotStatusValueObject {
  private readonly _value: string;
  /**
   * Creates a new PlotNameValueObject
   * @param props - The name properties
   */
  constructor(value: string) {
    this._value = value;
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  /**
   * Validates the name value object
   */
  protected validate(): void {
    const value = this._value;
    if (!value || value.trim().length === 0) {
      throw new InvalidPlotStatusException('Plot status must not be empty.');
    }
    if (!Object.values(PLOT_STATUS).includes(value as PLOT_STATUS)) {
      throw new InvalidPlotStatusException('Invalid plot status.');
    }
  }
}
