import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';
import { PlotEntity } from 'src/modules/plots/domain/entities/plot.entity';
import { PlotDimensionValueObject } from 'src/modules/plots/domain/value-objects/plot-dimension/plot-dimension.value-object';
import { PlotIdValueObject } from 'src/modules/plots/domain/value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from 'src/modules/plots/domain/value-objects/plot-name/plot-name.value-object';
import { PlotSoilTypeValueObject } from 'src/modules/plots/domain/value-objects/plot-soil-type/plot-soil-type.value-object';
import { PlotStatusValueObject } from 'src/modules/plots/domain/value-objects/plot-status/plot-status.value-object';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PlotMapper } from './plot.mapper';

describe('PlotMapper', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('fromDomain', () => {
    it('should map a complete PlotEntity to PlotResponseDto', () => {
      const plot = new PlotEntity({
        id: new PlotIdValueObject(validUuid),
        name: new PlotNameValueObject('Test Plot'),
        description: 'A test plot',
        dimensions: new PlotDimensionValueObject(
          10,
          20,
          1,
          UNIT_MEASUREMENT.METERS,
        ),
        status: new PlotStatusValueObject(PLOT_STATUS.ACTIVE),
        soilType: new PlotSoilTypeValueObject(PLOT_SOIL_TYPES.SANDY),
        soilPh: 6.5,
        farmId: 'farm-123',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });

      const result = PlotMapper.fromDomain(plot);

      expect(result.id).toBe(validUuid);
      expect(result.name).toBe('Test Plot');
      expect(result.description).toBe('A test plot');
      expect(result.dimensions.width).toBe(10);
      expect(result.dimensions.length).toBe(20);
      expect(result.dimensions.height).toBe(1);
      expect(result.dimensions.area).toBe(200);
      expect(result.dimensions.perimeter).toBe(60);
      expect(result.dimensions.volume).toBe(200);
      expect(result.dimensions.unitMeasurement).toBe(UNIT_MEASUREMENT.METERS);
      expect(result.dimensions.unitMeasurementCategory).toBe('METRIC');
      expect(result.status).toBe(PLOT_STATUS.ACTIVE);
      expect(result.soilType).toBe(PLOT_SOIL_TYPES.SANDY);
      expect(result.soilPh).toBe(6.5);
      expect(result.farmId).toBe('farm-123');
      expect(result.createdAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
      expect(result.deletedAt).toBeUndefined();
    });

    it('should map a PlotEntity with minimal data', () => {
      const plot = new PlotEntity({
        id: new PlotIdValueObject(validUuid),
        name: new PlotNameValueObject('Test Plot'),
        dimensions: new PlotDimensionValueObject(
          10,
          20,
          1,
          UNIT_MEASUREMENT.METERS,
        ),
        status: new PlotStatusValueObject(PLOT_STATUS.ACTIVE),
        soilPh: 7.0,
        farmId: 'farm-123',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });

      const result = PlotMapper.fromDomain(plot);

      expect(result.id).toBe(validUuid);
      expect(result.name).toBe('Test Plot');
      expect(result.description).toBeUndefined();
      expect(result.dimensions.width).toBe(10);
      expect(result.dimensions.length).toBe(20);
      expect(result.dimensions.height).toBe(1);
      expect(result.status).toBe(PLOT_STATUS.ACTIVE);
      expect(result.soilType).toBeUndefined();
      expect(result.soilPh).toBe(7.0);
      expect(result.farmId).toBe('farm-123');
      expect(result.createdAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
      expect(result.deletedAt).toBeUndefined();
    });

    it('should map a PlotEntity with soft delete', () => {
      const plot = new PlotEntity({
        id: new PlotIdValueObject(validUuid),
        name: new PlotNameValueObject('Test Plot'),
        dimensions: new PlotDimensionValueObject(
          10,
          20,
          1,
          UNIT_MEASUREMENT.METERS,
        ),
        status: new PlotStatusValueObject(PLOT_STATUS.ACTIVE),
        soilPh: 7.0,
        farmId: 'farm-123',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        deletedAt: new Date('2023-01-03'),
      });

      const result = PlotMapper.fromDomain(plot);

      expect(result.id).toBe(validUuid);
      expect(result.name).toBe('Test Plot');
      expect(result.deletedAt).toEqual(new Date('2023-01-03'));
    });

    it('should handle different unit measurements', () => {
      const plot = new PlotEntity({
        id: new PlotIdValueObject(validUuid),
        name: new PlotNameValueObject('Test Plot'),
        dimensions: new PlotDimensionValueObject(
          10,
          20,
          1,
          UNIT_MEASUREMENT.FEET,
        ),
        status: new PlotStatusValueObject(PLOT_STATUS.ACTIVE),
        soilPh: 7.0,
        farmId: 'farm-123',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      });

      const result = PlotMapper.fromDomain(plot);

      expect(result.dimensions.unitMeasurement).toBe(UNIT_MEASUREMENT.FEET);
      expect(result.dimensions.unitMeasurementCategory).toBe('IMPERIAL');
    });
  });
});
