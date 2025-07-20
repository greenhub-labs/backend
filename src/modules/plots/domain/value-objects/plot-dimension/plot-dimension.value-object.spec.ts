import { PlotDimensionValueObject } from './plot-dimension.value-object';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { InvalidPlotDimensionsException } from '../../exceptions/invalid-plot-dimensions/invalid-plot-dimensions.exception';

describe('PlotDimensionValueObject', () => {
  describe('constructor', () => {
    it('should create a plot dimension with default values', () => {
      const dimensions = new PlotDimensionValueObject();

      expect(dimensions.width).toBe(0);
      expect(dimensions.length).toBe(0);
      expect(dimensions.height).toBe(0);
      expect(dimensions.unitMeasurement).toBe(UNIT_MEASUREMENT.METERS);
      expect(dimensions.area).toBe(0);
      expect(dimensions.perimeter).toBe(0);
      expect(dimensions.volume).toBe(0);
    });

    it('should create a plot dimension with provided values', () => {
      const dimensions = new PlotDimensionValueObject(
        10,
        20,
        5,
        UNIT_MEASUREMENT.METERS,
      );

      expect(dimensions.width).toBe(10);
      expect(dimensions.length).toBe(20);
      expect(dimensions.height).toBe(5);
      expect(dimensions.unitMeasurement).toBe(UNIT_MEASUREMENT.METERS);
      expect(dimensions.area).toBe(200); // 10 * 20
      expect(dimensions.perimeter).toBe(60); // 2 * (10 + 20)
      expect(dimensions.volume).toBe(1000); // 10 * 20 * 5
    });

    it('should throw exception for negative dimensions', () => {
      expect(() => {
        new PlotDimensionValueObject(-1, 10, 5);
      }).toThrow(InvalidPlotDimensionsException);
    });

    it('should allow zero dimensions', () => {
      expect(() => {
        new PlotDimensionValueObject(0, 0, 0);
      }).not.toThrow();
    });
  });

  describe('conversion methods', () => {
    it('should convert from meters to feet', () => {
      const dimensions = new PlotDimensionValueObject(
        10, // 10 meters
        20, // 20 meters
        5, // 5 meters
        UNIT_MEASUREMENT.METERS,
      );

      const imperialDimensions = dimensions.convertToImperial();

      expect(imperialDimensions.unitMeasurement).toBe(UNIT_MEASUREMENT.FEET);
      expect(imperialDimensions.width).toBeCloseTo(32.8084, 2); // 10m * 3.28084
      expect(imperialDimensions.length).toBeCloseTo(65.6168, 2); // 20m * 3.28084
      expect(imperialDimensions.height).toBeCloseTo(16.4042, 2); // 5m * 3.28084
    });

    it('should convert from feet to meters', () => {
      const dimensions = new PlotDimensionValueObject(
        32.8084, // 32.8084 feet
        65.6168, // 65.6168 feet
        16.4042, // 16.4042 feet
        UNIT_MEASUREMENT.FEET,
      );

      const metricDimensions = dimensions.convertToMetric();

      expect(metricDimensions.unitMeasurement).toBe(UNIT_MEASUREMENT.METERS);
      expect(metricDimensions.width).toBeCloseTo(10, 2);
      expect(metricDimensions.length).toBeCloseTo(20, 2);
      expect(metricDimensions.height).toBeCloseTo(5, 2);
    });

    it('should convert to specific unit', () => {
      const dimensions = new PlotDimensionValueObject(
        100, // 100 centimeters
        200, // 200 centimeters
        50, // 50 centimeters
        UNIT_MEASUREMENT.CENTIMETERS,
      );

      const metersDimensions = dimensions.convertToUnit(
        UNIT_MEASUREMENT.METERS,
      );

      expect(metersDimensions.unitMeasurement).toBe(UNIT_MEASUREMENT.METERS);
      expect(metersDimensions.width).toBe(1); // 100cm = 1m
      expect(metersDimensions.length).toBe(2); // 200cm = 2m
      expect(metersDimensions.height).toBe(0.5); // 50cm = 0.5m
    });

    it('should not convert if already in target unit', () => {
      const dimensions = new PlotDimensionValueObject(
        10,
        20,
        5,
        UNIT_MEASUREMENT.METERS,
      );

      const sameDimensions = dimensions.convertToUnit(UNIT_MEASUREMENT.METERS);

      expect(sameDimensions).toBe(dimensions);
    });
  });

  describe('calculation methods', () => {
    it('should calculate area correctly', () => {
      const dimensions = new PlotDimensionValueObject(10, 20, 5);

      expect(dimensions.getArea()).toBe(200); // 10 * 20
    });

    it('should calculate perimeter correctly', () => {
      const dimensions = new PlotDimensionValueObject(10, 20, 5);

      expect(dimensions.getPerimeter()).toBe(60); // 2 * (10 + 20)
    });

    it('should calculate volume correctly', () => {
      const dimensions = new PlotDimensionValueObject(10, 20, 5);

      expect(dimensions.getVolume()).toBe(1000); // 10 * 20 * 5
    });
  });

  describe('getter methods', () => {
    it('should return correct dimensions', () => {
      const dimensions = new PlotDimensionValueObject(
        10,
        20,
        5,
        UNIT_MEASUREMENT.FEET,
      );

      expect(dimensions.getWidth()).toBe(10);
      expect(dimensions.getLength()).toBe(20);
      expect(dimensions.getHeight()).toBe(5);
      expect(dimensions.getUnitMeasurement()).toBe(UNIT_MEASUREMENT.FEET);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const dimensions = new PlotDimensionValueObject(
        10,
        20,
        5,
        UNIT_MEASUREMENT.METERS,
      );
      const json = dimensions.toJSON();

      expect(json).toEqual({
        width: 10,
        length: 20,
        height: 5,
        area: 200,
        perimeter: 60,
        volume: 1000,
        unitMeasurement: UNIT_MEASUREMENT.METERS,
        unitMeasurementCategory: 'METRIC',
      });
    });
  });
});
