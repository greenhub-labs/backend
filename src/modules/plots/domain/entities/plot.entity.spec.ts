import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { PLOT_SOIL_TYPES } from '../constants/plot-soil-types.constant';
import { PLOT_STATUS } from '../constants/plot-status.constant';
import { PlotDimensionValueObject } from '../value-objects/plot-dimension/plot-dimension.value-object';
import { PlotIdValueObject } from '../value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from '../value-objects/plot-name/plot-name.value-object';
import { PlotSoilTypeValueObject } from '../value-objects/plot-soil-type/plot-soil-type.value-object';
import { PlotStatusValueObject } from '../value-objects/plot-status/plot-status.value-object';
import { PlotEntity } from './plot.entity';

describe('PlotEntity', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';
  const baseProps = {
    id: new PlotIdValueObject(validUuid),
    name: new PlotNameValueObject('Test Plot'),
    description: 'A test plot',
    dimensions: new PlotDimensionValueObject(
      10,
      20,
      2,
      UNIT_MEASUREMENT.METERS,
    ),
    status: new PlotStatusValueObject(PLOT_STATUS.ACTIVE),
    soilType: new PlotSoilTypeValueObject(PLOT_SOIL_TYPES.SANDY),
    soilPh: 6.5,
    farmId: 'farm-uuid',
  };

  it('should create a valid PlotEntity and emit PlotCreatedDomainEvent', () => {
    const plot = new PlotEntity(baseProps);
    expect(plot.id.value).toBe(validUuid);
    expect(plot.name.value).toBe('Test Plot');
    expect(plot.description).toBe('A test plot');
    expect(plot.dimensions.width).toBe(10);
    expect(plot.status.value).toBe(PLOT_STATUS.ACTIVE);
    expect(plot.soilType?.value).toBe(PLOT_SOIL_TYPES.SANDY);
    expect(plot.soilPh).toBe(6.5);
    expect(plot.farmId).toBe('farm-uuid');
    const events = plot.pullDomainEvents();
    expect(events.length).toBe(1);
    expect(events[0].constructor.name).toBe('PlotCreatedDomainEvent');
  });

  it('should update the plot and emit PlotUpdatedDomainEvent', () => {
    const plot = new PlotEntity(baseProps);
    plot.pullDomainEvents(); // clear creation event
    const updated = plot.update({
      name: 'Updated Name',
      status: PLOT_STATUS.RESTING,
    });
    expect(updated.name.value).toBe('Updated Name');
    expect(updated.status.value).toBe(PLOT_STATUS.RESTING);
    const events = updated.pullDomainEvents();
    expect(
      events.some((e) => e.constructor.name === 'PlotUpdatedDomainEvent'),
    ).toBe(true);
  });

  it('should soft delete the plot and emit PlotDeletedDomainEvent', () => {
    const plot = new PlotEntity(baseProps);
    plot.pullDomainEvents(); // clear creation event
    const deleted = plot.delete();
    expect(deleted.isDeleted).toBe(true);
    expect(deleted.deletedAt).toBeInstanceOf(Date);
    const events = deleted.pullDomainEvents();
    expect(
      events.some((e) => e.constructor.name === 'PlotDeletedDomainEvent'),
    ).toBe(true);
  });

  it('should convert to and from primitives', () => {
    const plot = new PlotEntity(baseProps);
    const primitives = plot.toPrimitives();
    const from = PlotEntity.fromPrimitives(primitives);
    expect(from.id.value).toBe(plot.id.value);
    expect(from.name.value).toBe(plot.name.value);
    expect(from.dimensions.width).toBe(plot.dimensions.width);
    expect(from.status.value).toBe(plot.status.value);
    expect(from.soilType?.value).toBe(plot.soilType?.value);
    expect(from.soilPh).toBe(plot.soilPh);
    expect(from.farmId).toBe(plot.farmId);
    expect(from.createdAt.toISOString()).toBe(plot.createdAt.toISOString());
    expect(from.updatedAt.toISOString()).toBe(plot.updatedAt.toISOString());
  });

  it('should handle optional fields', () => {
    const props = { ...baseProps, description: undefined, soilType: undefined };
    const plot = new PlotEntity(props);
    expect(plot.description).toBeUndefined();
    expect(plot.soilType).toBeUndefined();
  });
});
