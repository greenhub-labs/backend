import { InvalidPlotDimensionsException } from '../../exceptions/invalid-plot-dimensions/invalid-plot-dimensions.exception';
import {
  UNIT_MEASUREMENT,
  convertUnit,
  getUnitMeasurementCategory,
  UNIT_MEASUREMENT_CATEGORY,
} from 'src/shared/domain/constants/unit-measurement.constant';

export class PlotDimensionValueObject {
  public readonly width: number;
  public readonly length: number;
  public readonly height: number;
  public readonly area: number;
  public readonly perimeter: number;
  public readonly volume: number;
  public readonly unitMeasurement: UNIT_MEASUREMENT;

  constructor(
    width?: number,
    length?: number,
    height?: number,
    unitMeasurement?: UNIT_MEASUREMENT,
  ) {
    // Set default values for undefined dimensions
    this.width = width ?? 0;
    this.length = length ?? 0;
    this.height = height ?? 0;
    this.unitMeasurement = unitMeasurement ?? UNIT_MEASUREMENT.METERS;

    this.validate();

    this.area = this.calculateArea(this.width, this.length);
    this.perimeter = this.calculatePerimeter(this.width, this.length);
    this.volume = this.calculateVolume(this.width, this.length, this.height);
  }

  /**
   * Calculates the area of the plot
   * @param width - Width of the plot
   * @param length - Length of the plot
   * @returns Area in square units
   */
  calculateArea(width: number, length: number): number {
    return width * length;
  }

  /**
   * Calculates the perimeter of the plot
   * @param width - Width of the plot
   * @param length - Length of the plot
   * @returns Perimeter in the same units
   */
  calculatePerimeter(width: number, length: number): number {
    return 2 * (width + length);
  }

  /**
   * Calculates the volume of the plot
   * @param width - Width of the plot
   * @param length - Length of the plot
   * @param height - Height of the plot
   * @returns Volume in cubic units
   */
  calculateVolume(width: number, length: number, height: number): number {
    return width * length * height;
  }

  /**
   * Converts dimensions to imperial units
   * @returns New PlotDimensionValueObject with imperial units
   */
  convertToImperial(): PlotDimensionValueObject {
    if (
      getUnitMeasurementCategory(this.unitMeasurement) ===
      UNIT_MEASUREMENT_CATEGORY.IMPERIAL
    ) {
      return this;
    }

    const targetUnit = UNIT_MEASUREMENT.FEET; // Default to feet for imperial
    return new PlotDimensionValueObject(
      convertUnit(this.width, this.unitMeasurement, targetUnit),
      convertUnit(this.length, this.unitMeasurement, targetUnit),
      convertUnit(this.height, this.unitMeasurement, targetUnit),
      targetUnit,
    );
  }

  /**
   * Converts dimensions to metric units
   * @returns New PlotDimensionValueObject with metric units
   */
  convertToMetric(): PlotDimensionValueObject {
    if (
      getUnitMeasurementCategory(this.unitMeasurement) ===
      UNIT_MEASUREMENT_CATEGORY.METRIC
    ) {
      return this;
    }

    const targetUnit = UNIT_MEASUREMENT.METERS; // Default to meters for metric
    return new PlotDimensionValueObject(
      convertUnit(this.width, this.unitMeasurement, targetUnit),
      convertUnit(this.length, this.unitMeasurement, targetUnit),
      convertUnit(this.height, this.unitMeasurement, targetUnit),
      targetUnit,
    );
  }

  /**
   * Converts dimensions to a specific unit
   * @param targetUnit - The target unit to convert to
   * @returns New PlotDimensionValueObject with the target unit
   */
  convertToUnit(targetUnit: UNIT_MEASUREMENT): PlotDimensionValueObject {
    if (this.unitMeasurement === targetUnit) {
      return this;
    }

    return new PlotDimensionValueObject(
      convertUnit(this.width, this.unitMeasurement, targetUnit),
      convertUnit(this.length, this.unitMeasurement, targetUnit),
      convertUnit(this.height, this.unitMeasurement, targetUnit),
      targetUnit,
    );
  }

  /**
   * Validates the plot dimensions
   */
  validate(): void {
    // Allow zero values for optional dimensions
    if (this.width < 0 || this.length < 0 || this.height < 0) {
      throw new InvalidPlotDimensionsException(
        'Plot dimensions must be greater than or equal to 0',
      );
    }

    if (!Object.values(UNIT_MEASUREMENT).includes(this.unitMeasurement)) {
      throw new InvalidPlotDimensionsException('Invalid unit measurement');
    }
  }

  /**
   * Gets the area of the plot
   * @returns Area in square units
   */
  getArea(): number {
    return this.area;
  }

  /**
   * Gets the perimeter of the plot
   * @returns Perimeter in the same units
   */
  getPerimeter(): number {
    return this.perimeter;
  }

  /**
   * Gets the volume of the plot
   * @returns Volume in cubic units
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Gets the unit of measurement
   * @returns Unit of measurement
   */
  getUnitMeasurement(): UNIT_MEASUREMENT {
    return this.unitMeasurement;
  }

  /**
   * Gets the width of the plot
   * @returns Width in the specified unit
   */
  getWidth(): number {
    return this.width;
  }

  /**
   * Gets the length of the plot
   * @returns Length in the specified unit
   */
  getLength(): number {
    return this.length;
  }

  /**
   * Gets the height of the plot
   * @returns Height in the specified unit
   */
  getHeight(): number {
    return this.height;
  }

  /**
   * Gets the category of the unit measurement
   * @returns Unit measurement category
   */
  getUnitMeasurementCategory(): UNIT_MEASUREMENT_CATEGORY {
    return getUnitMeasurementCategory(this.unitMeasurement);
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
      width: this.width,
      length: this.length,
      height: this.height,
      area: this.area,
      perimeter: this.perimeter,
      volume: this.volume,
      unitMeasurement: this.unitMeasurement,
      unitMeasurementCategory: this.getUnitMeasurementCategory(),
    };
  }
}
