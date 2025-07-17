import { InvalidPlotNameException } from '../../exceptions/invalid-plot-name/invalid-plot-name.exception';

/**
 * Value Object representing the name of a Plot.
 *
 * @property name - The name of the plot
 */

export class PlotNameValueObject {
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
      throw new InvalidPlotNameException('Plot name must not be empty.');
    }
    if (value.length > 100) {
      throw new InvalidPlotNameException(
        'Plot name must not exceed 100 characters.',
      );
    }
  }
}
