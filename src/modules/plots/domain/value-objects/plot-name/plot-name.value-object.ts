import { InvalidPlotNameException } from '../../exceptions/invalid-plot-name/invalid-plot-name.exception';

/**
 * Value Object representing the name of a Plot.
 *
 * @property name - The name of the plot
 */

export class PlotNameValueObject {
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
      throw new InvalidPlotNameException('Plot name must not be empty.');
    }
    if (value.length > 100) {
      throw new InvalidPlotNameException(
        'Plot name must not exceed 100 characters.',
      );
    }
  }
}
