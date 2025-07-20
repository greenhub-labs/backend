import { PLOT_SOIL_TYPES } from '../../constants/plot-soil-types.constant';
import { InvalidPlotSoilTypeException } from '../../exceptions/invalid-plot-soil-type/invalid-plot-soil-type.exception';

/**
 * Value Object representing the name of a Plot.
 *
 * @property name - The name of the plot
 */

export class PlotSoilTypeValueObject {
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
      throw new InvalidPlotSoilTypeException(
        'Plot soil type must not be empty.',
      );
    }
    if (!Object.values(PLOT_SOIL_TYPES).includes(value as PLOT_SOIL_TYPES)) {
      throw new InvalidPlotSoilTypeException('Invalid plot soil type.');
    }
  }
}
