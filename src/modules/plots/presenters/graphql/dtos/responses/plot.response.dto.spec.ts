import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import {
  UNIT_MEASUREMENT,
  UNIT_MEASUREMENT_CATEGORY,
} from 'src/shared/domain/constants/unit-measurement.constant';
import {
  PlotDimensionsResponseDto,
  PlotResponseDto,
} from './plot.response.dto';

describe('PlotResponseDto', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('PlotDimensionsResponseDto', () => {
    it('should create a valid dimensions DTO', () => {
      const dimensions = new PlotDimensionsResponseDto();
      dimensions.width = 10;
      dimensions.length = 20;
      dimensions.height = 1;
      dimensions.area = 200;
      dimensions.perimeter = 60;
      dimensions.volume = 200;
      dimensions.unitMeasurement = UNIT_MEASUREMENT.METERS;
      dimensions.unitMeasurementCategory = UNIT_MEASUREMENT_CATEGORY.METRIC;

      expect(dimensions.width).toBe(10);
      expect(dimensions.length).toBe(20);
      expect(dimensions.height).toBe(1);
      expect(dimensions.area).toBe(200);
      expect(dimensions.perimeter).toBe(60);
      expect(dimensions.volume).toBe(200);
      expect(dimensions.unitMeasurement).toBe(UNIT_MEASUREMENT.METERS);
      expect(dimensions.unitMeasurementCategory).toBe(
        UNIT_MEASUREMENT_CATEGORY.METRIC,
      );
    });

    it('should handle null values', () => {
      const dimensions = new PlotDimensionsResponseDto();
      dimensions.width = null;
      dimensions.length = null;
      dimensions.height = null;
      dimensions.area = null;
      dimensions.perimeter = null;
      dimensions.volume = null;
      dimensions.unitMeasurement = null;
      dimensions.unitMeasurementCategory = null;

      expect(dimensions.width).toBeNull();
      expect(dimensions.length).toBeNull();
      expect(dimensions.height).toBeNull();
      expect(dimensions.area).toBeNull();
      expect(dimensions.perimeter).toBeNull();
      expect(dimensions.volume).toBeNull();
      expect(dimensions.unitMeasurement).toBeNull();
      expect(dimensions.unitMeasurementCategory).toBeNull();
    });
  });

  describe('PlotResponseDto', () => {
    it('should create a valid plot response DTO', () => {
      const plot = new PlotResponseDto();
      plot.id = validUuid;
      plot.name = 'Test Plot';
      plot.description = 'A test plot';
      plot.dimensions = new PlotDimensionsResponseDto();
      plot.dimensions.width = 10;
      plot.dimensions.length = 20;
      plot.dimensions.height = 1;
      plot.dimensions.area = 200;
      plot.dimensions.perimeter = 60;
      plot.dimensions.volume = 200;
      plot.dimensions.unitMeasurement = UNIT_MEASUREMENT.METERS;
      plot.dimensions.unitMeasurementCategory =
        UNIT_MEASUREMENT_CATEGORY.METRIC;
      plot.status = 'ACTIVE';
      plot.soilType = PLOT_SOIL_TYPES.SANDY;
      plot.soilPh = 6.5;
      plot.farmId = 'farm-123';
      plot.createdAt = new Date('2023-01-01');
      plot.updatedAt = new Date('2023-01-02');

      expect(plot.id).toBe(validUuid);
      expect(plot.name).toBe('Test Plot');
      expect(plot.description).toBe('A test plot');
      expect(plot.dimensions).toBeInstanceOf(PlotDimensionsResponseDto);
      expect(plot.status).toBe('ACTIVE');
      expect(plot.soilType).toBe(PLOT_SOIL_TYPES.SANDY);
      expect(plot.soilPh).toBe(6.5);
      expect(plot.farmId).toBe('farm-123');
      expect(plot.createdAt).toEqual(new Date('2023-01-01'));
      expect(plot.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should handle optional fields', () => {
      const plot = new PlotResponseDto();
      plot.id = validUuid;
      plot.name = 'Test Plot';

      expect(plot.id).toBe(validUuid);
      expect(plot.name).toBe('Test Plot');
      expect(plot.description).toBeUndefined();
      expect(plot.dimensions).toBeUndefined();
      expect(plot.status).toBeUndefined();
      expect(plot.soilType).toBeUndefined();
      expect(plot.soilPh).toBeUndefined();
      expect(plot.farmId).toBeUndefined();
      expect(plot.createdAt).toBeUndefined();
      expect(plot.updatedAt).toBeUndefined();
      expect(plot.deletedAt).toBeUndefined();
    });

    it('should handle soft delete with deletedAt', () => {
      const plot = new PlotResponseDto();
      plot.id = validUuid;
      plot.name = 'Test Plot';
      plot.deletedAt = new Date('2023-01-03');

      expect(plot.id).toBe(validUuid);
      expect(plot.name).toBe('Test Plot');
      expect(plot.deletedAt).toEqual(new Date('2023-01-03'));
    });
  });
});
