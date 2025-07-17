import { InvalidPlotDimensionsException } from '../../exceptions/invalid-plot-dimensions/invalid-plot-dimensions.exception';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';

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
    this.unitMeasurement = unitMeasurement ?? UNIT_MEASUREMENT.METRIC;

    this.validate();

    this.area = this.calculateArea(this.width, this.length);
    this.perimeter = this.calculatePerimeter(this.width, this.length);
    this.volume = this.calculateVolume(this.width, this.length, this.height);
  }

  calculateArea(width: number, length: number): number {
    return width * length;
  }

  calculatePerimeter(width: number, length: number): number {
    return 2 * (width + length);
  }

  calculateVolume(width: number, length: number, height: number): number {
    return width * length * height;
  }

  convertToImperial(value: number): number {
    if (this.unitMeasurement === UNIT_MEASUREMENT.IMPERIAL) {
      return value;
    }
    return value * 3.28084;
  }

  convertToMetric(value: number): number {
    if (this.unitMeasurement === UNIT_MEASUREMENT.METRIC) {
      return value;
    }
    return value / 3.28084;
  }

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

  getArea(): number {
    return this.area;
  }

  getPerimeter(): number {
    return this.perimeter;
  }

  getVolume(): number {
    return this.volume;
  }

  getUnitMeasurement(): UNIT_MEASUREMENT {
    return this.unitMeasurement;
  }

  getWidth(): number {
    return this.width;
  }

  getLength(): number {
    return this.length;
  }

  getHeight(): number {
    return this.height;
  }

  toJSON(): {
    width: number;
    length: number;
    height: number;
    area: number;
    perimeter: number;
    volume: number;
    unitMeasurement: UNIT_MEASUREMENT;
  } {
    return {
      width: this.width,
      length: this.length,
      height: this.height,
      area: this.area,
      perimeter: this.perimeter,
      volume: this.volume,
      unitMeasurement: this.unitMeasurement,
    };
  }
}
