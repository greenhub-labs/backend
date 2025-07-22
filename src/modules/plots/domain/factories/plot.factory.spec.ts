import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PLOT_SOIL_TYPES } from '../constants/plot-soil-types.constant';
import { PLOT_STATUS } from '../constants/plot-status.constant';
import { PlotEntity } from '../entities/plot.entity';
import { PlotFactory } from './plot.factory';

describe('PlotFactory', () => {
  let factory: PlotFactory;
  beforeEach(() => {
    factory = new PlotFactory();
  });

  it('should create a PlotEntity with minimal data', () => {
    const entity = factory.create({
      name: 'Test Plot',
    });
    expect(entity).toBeInstanceOf(PlotEntity);
    expect(entity.name.value).toBe('Test Plot');
    expect(entity.status.value).toBe(PLOT_STATUS.PREPARING);
    expect(entity.id.value).toMatch(/[0-9a-f\-]{36}/i);
  });

  it('should create a PlotEntity with all fields', () => {
    const entity = factory.create({
      name: 'Full Plot',
      description: 'A complete plot',
      width: 10,
      length: 20,
      height: 5,
      unitMeasurement: UNIT_MEASUREMENT.METERS,
      status: PLOT_STATUS.ACTIVE,
      soilType: PLOT_SOIL_TYPES.SANDY,
      soilPh: 6.5,
      farmId: 'farm-uuid',
    });
    expect(entity.name.value).toBe('Full Plot');
    expect(entity.description).toBe('A complete plot');
    expect(entity.dimensions.width).toBe(10);
    expect(entity.dimensions.length).toBe(20);
    expect(entity.dimensions.height).toBe(5);
    expect(entity.dimensions.unitMeasurement).toBe(UNIT_MEASUREMENT.METERS);
    expect(entity.status.value).toBe(PLOT_STATUS.ACTIVE);
    expect(entity.soilType?.value).toBe(PLOT_SOIL_TYPES.SANDY);
    expect(entity.soilPh).toBe(6.5);
    expect(entity.farmId).toBe('farm-uuid');
  });

  it('should reconstruct a PlotEntity from primitives', () => {
    const now = new Date();
    const entity = PlotFactory.fromPrimitives({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Restored Plot',
      description: 'Restored',
      width: 10,
      length: 20,
      height: 5,
      unitMeasurement: UNIT_MEASUREMENT.METERS,
      status: PLOT_STATUS.RESTING,
      soilType: PLOT_SOIL_TYPES.CLAY,
      soilPh: 7.2,
      farmId: 'farm-uuid',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: undefined,
    });
    expect(entity).toBeInstanceOf(PlotEntity);
    expect(entity.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(entity.name.value).toBe('Restored Plot');
    expect(entity.status.value).toBe(PLOT_STATUS.RESTING);
    expect(entity.soilType?.value).toBe(PLOT_SOIL_TYPES.CLAY);
    expect(entity.soilPh).toBe(7.2);
    expect(entity.farmId).toBe('farm-uuid');
    expect(entity.createdAt.toISOString()).toBe(now.toISOString());
    expect(entity.updatedAt.toISOString()).toBe(now.toISOString());
    expect(entity.deletedAt).toBeUndefined();
  });
});
