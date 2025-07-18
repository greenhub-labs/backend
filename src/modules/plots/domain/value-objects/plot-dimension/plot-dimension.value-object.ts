import {
  convertUnit,
  getUnitMeasurementCategory,
  UNIT_MEASUREMENT,
  UNIT_MEASUREMENT_CATEGORY,
} from 'src/shared/domain/constants/unit-measurement.constant';
import { InvalidPlotDimensionsException } from '../../exceptions/invalid-plot-dimensions/invalid-plot-dimensions.exception';

export class PlotDimensionValueObject {
  private readonly _width: number;
  private readonly _length: number;
  private readonly _height: number;
  private readonly _area: number;
  private readonly _perimeter: number;
  private readonly _volume: number;
  private readonly _unitMeasurement: UNIT_MEASUREMENT;

  constructor(
    width?: number,
    length?: number,
    height?: number,
    unitMeasurement?: UNIT_MEASUREMENT,
  ) {
    // Set default values for undefined dimensions
    this._width = width ?? 0;
    this._length = length ?? 0;
    this._height = height ?? 0;
    this._unitMeasurement = unitMeasurement ?? UNIT_MEASUREMENT.METERS;

    this.validate();

    this._area = this.calculateArea(this._width, this._length);
    this._perimeter = this.calculatePerimeter(this._width, this._length);
    this._volume = this.calculateVolume(
      this._width,
      this._length,
      this._height,
    );
  }

  /**
   * Gets the width of the plot
   * @returns Width in the specified unit
   */
  get width(): number {
    return this._width;
  }

  /**
   * Gets the length of the plot
   * @returns Length in the specified unit
   */
  get length(): number {
    return this._length;
  }

  /**
   * Gets the height of the plot
   * @returns Height in the specified unit
   */
  get height(): number {
    return this._height;
  }

  /**
   * Gets the area of the plot
   * @returns Area in square units
   */
  get area(): number {
    return this._area;
  }

  /**
   * Gets the perimeter of the plot
   * @returns Perimeter in the same units
   */
  get perimeter(): number {
    return this._perimeter;
  }

  /**
   * Gets the volume of the plot
   * @returns Volume in cubic units
   */
  get volume(): number {
    return this._volume;
  }

  /**
   * Gets the unit of measurement
   * @returns Unit of measurement
   */
  get unitMeasurement(): UNIT_MEASUREMENT {
    return this._unitMeasurement;
  }

  /**
   * Calculates the area of the plot
   * @param width - Width of the plot
   * @param length - Length of the plot
   * @returns Area in square units
   */
  private calculateArea(width: number, length: number): number {
    return width * length;
  }

  /**
   * Calculates the perimeter of the plot
   * @param width - Width of the plot
   * @param length - Length of the plot
   * @returns Perimeter in the same units
   */
  private calculatePerimeter(width: number, length: number): number {
    return 2 * (width + length);
  }

  /**
   * Calculates the volume of the plot
   * @param width - Width of the plot
   * @param length - Length of the plot
   * @param height - Height of the plot
   * @returns Volume in cubic units
   */
  private calculateVolume(
    width: number,
    length: number,
    height: number,
  ): number {
    return width * length * height;
  }

  /**
   * Converts dimensions to imperial units
   * @returns New PlotDimensionValueObject with imperial units
   */
  convertToImperial(): PlotDimensionValueObject {
    if (
      getUnitMeasurementCategory(this._unitMeasurement) ===
      UNIT_MEASUREMENT_CATEGORY.IMPERIAL
    ) {
      return this;
    }

    const targetUnit = UNIT_MEASUREMENT.FEET; // Default to feet for imperial
    return new PlotDimensionValueObject(
      convertUnit(this._width, this._unitMeasurement, targetUnit),
      convertUnit(this._length, this._unitMeasurement, targetUnit),
      convertUnit(this._height, this._unitMeasurement, targetUnit),
      targetUnit,
    );
  }

  /**
   * Converts dimensions to metric units
   * @returns New PlotDimensionValueObject with metric units
   */
  convertToMetric(): PlotDimensionValueObject {
    if (
      getUnitMeasurementCategory(this._unitMeasurement) ===
      UNIT_MEASUREMENT_CATEGORY.METRIC
    ) {
      return this;
    }

    const targetUnit = UNIT_MEASUREMENT.METERS; // Default to meters for metric
    return new PlotDimensionValueObject(
      convertUnit(this._width, this._unitMeasurement, targetUnit),
      convertUnit(this._length, this._unitMeasurement, targetUnit),
      convertUnit(this._height, this._unitMeasurement, targetUnit),
      targetUnit,
    );
  }

  /**
   * Converts dimensions to a specific unit
   * @param targetUnit - The target unit to convert to
   * @returns New PlotDimensionValueObject with the target unit
   */
  convertToUnit(targetUnit: UNIT_MEASUREMENT): PlotDimensionValueObject {
    if (this._unitMeasurement === targetUnit) {
      return this;
    }

    return new PlotDimensionValueObject(
      convertUnit(this._width, this._unitMeasurement, targetUnit),
      convertUnit(this._length, this._unitMeasurement, targetUnit),
      convertUnit(this._height, this._unitMeasurement, targetUnit),
      targetUnit,
    );
  }

  /**
   * Validates the plot dimensions
   */
  private validate(): void {
    // Allow zero values for optional dimensions
    if (this._width < 0 || this._length < 0 || this._height < 0) {
      throw new InvalidPlotDimensionsException(
        'Plot dimensions must be greater than or equal to 0',
      );
    }

    if (!Object.values(UNIT_MEASUREMENT).includes(this._unitMeasurement)) {
      throw new InvalidPlotDimensionsException('Invalid unit measurement');
    }
  }

  /**
   * Gets the category of the unit measurement
   * @returns Unit measurement category
   */
  getUnitMeasurementCategory(): UNIT_MEASUREMENT_CATEGORY {
    return getUnitMeasurementCategory(this._unitMeasurement);
  }

  /**
   * Converts the value object to JSON representation
   * @returns JSON representation of the plot dimensions
   */
  toJSON(): {
    width: number;
    length: number;
    height: number;
    area: number;
    perimeter: number;
    volume: number;
    unitMeasurement: UNIT_MEASUREMENT;
    unitMeasurementCategory: UNIT_MEASUREMENT_CATEGORY;
  } {
    return {
      width: this._width,
      length: this._length,
      height: this._height,
      area: this._area,
      perimeter: this._perimeter,
      volume: this._volume,
      unitMeasurement: this._unitMeasurement,
      unitMeasurementCategory: this.getUnitMeasurementCategory(),
    };
  }
}
