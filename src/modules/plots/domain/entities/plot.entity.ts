import { PlotIdValueObject } from '../value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from '../value-objects/plot-name/plot-name.value-object';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { PlotCreatedDomainEvent } from '../events/plot-created/plot-created.domain-event';
import { PlotUpdatedDomainEvent } from '../events/plot-updated/plot-updated.domain-event';
import { PlotDeletedDomainEvent } from '../events/plot-deleted/plot-deleted.domain-event';
import { PlotsPrimitive } from '../primitives/plot.primitive';
import { PlotStatusValueObject } from '../value-objects/plot-status/plot-status.value-object';
import { PlotDimensionValueObject } from '../value-objects/plot-dimension/plot-dimension.value-object';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';

/**
 * Entity representing a Farm in the domain.
 */
export class PlotEntity {
  /** Unique identifier of the farm */
  readonly id: PlotIdValueObject;
  /** Name of the farm */
  name: PlotNameValueObject;
  /** Optional description of the farm */
  description?: string;
  /** Dimensions of the plot */
  dimensions: PlotDimensionValueObject;
  /** Status of the plot */
  status: PlotStatusValueObject;
  /** Soil type of the plot */
  soilType: string;
  /** Soil pH of the plot */
  soilPh: number;
  /** Farm ID */
  farmId: string;
  /** Creation date */
  readonly createdAt: Date;
  /** Last update date */
  updatedAt: Date;
  /** Soft delete date */
  deletedAt?: Date;

  /**
   * Internal collection of domain events
   */
  private readonly domainEvents: DomainEvent[] = [];

  /**
   * Creates a new FarmEntity and emits FarmCreatedDomainEvent
   * @param params - Farm entity properties
   */
  constructor(params: {
    id: PlotIdValueObject;
    name: PlotNameValueObject;
    description?: string;
    dimensions: PlotDimensionValueObject;
    status: PlotStatusValueObject;
    soilType: string;
    soilPh: number;
    farmId: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    emitEvent?: boolean; // For fromPrimitives, avoid duplicate event
  }) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.dimensions = params.dimensions;
    this.status = params.status;
    this.soilType = params.soilType;
    this.soilPh = params.soilPh;
    this.farmId = params.farmId;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt;
    // Emit event only if not restoring from persistence
    if (params.emitEvent !== false) {
      this.addDomainEvent(
        new PlotCreatedDomainEvent({
          eventId: crypto.randomUUID(),
          aggregateId: this.id.value,
          occurredAt: this.createdAt.toISOString(),
          name: this.name.value,
          description: this.description,
          width: this.dimensions.getWidth(),
          length: this.dimensions.getLength(),
          height: this.dimensions.getHeight(),
          area: this.dimensions.getArea(),
          perimeter: this.dimensions.getPerimeter(),
          volume: this.dimensions.getVolume(),
          unitMeasurement: this.dimensions.getUnitMeasurement(),
          status: this.status.value,
          soilType: this.soilType,
          soilPh: this.soilPh,
          farmId: this.farmId,
        }),
      );
    }
  }

  /**
   * Updates the farm with the given data (immutable) and emits FarmUpdatedDomainEvent
   * @param data - The data to update the farm with
   * @returns A new FarmEntity instance with the updated data
   */
  update(
    data: Partial<{
      name: string;
      description: string;
      width: number;
      length: number;
      height: number;
      area: number;
      perimeter: number;
      volume: number;
      unitMeasurement: UNIT_MEASUREMENT;
      status: string;
      soilType: string;
      soilPh: number;
      farmId: string;
    }>,
  ): PlotEntity {
    const updatedPlot = new PlotEntity({
      id: this.id,
      name: data.name ? new PlotNameValueObject(data.name) : this.name,
      description: data.description ?? this.description,
      dimensions: new PlotDimensionValueObject(
        data.width ?? this.dimensions.getWidth(),
        data.length ?? this.dimensions.getLength(),
        data.height ?? this.dimensions.getHeight(),
        data.unitMeasurement ?? this.dimensions.getUnitMeasurement(),
      ),
      status: data.status
        ? new PlotStatusValueObject(data.status)
        : this.status,
      soilType: data.soilType ?? this.soilType,
      soilPh: data.soilPh ?? this.soilPh,
      farmId: data.farmId ?? this.farmId,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      deletedAt: this.deletedAt,
    });
    updatedPlot.addDomainEvent(
      new PlotUpdatedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: updatedPlot.id.value,
        occurredAt: updatedPlot.updatedAt.toISOString(),
        name: updatedPlot.name.value,
        description: updatedPlot.description,
        width: updatedPlot.dimensions.getWidth(),
        length: updatedPlot.dimensions.getLength(),
        height: updatedPlot.dimensions.getHeight(),
        area: updatedPlot.dimensions.getArea(),
        perimeter: updatedPlot.dimensions.getPerimeter(),
        volume: updatedPlot.dimensions.getVolume(),
        unitMeasurement: updatedPlot.dimensions.getUnitMeasurement(),
        status: updatedPlot.status.value,
        soilType: updatedPlot.soilType,
        soilPh: updatedPlot.soilPh,
        farmId: updatedPlot.farmId,
      }),
    );
    return updatedPlot;
  }

  /**
   * Marks the farm as deleted (soft delete) and emits FarmDeletedDomainEvent
   * @returns A new FarmEntity instance marked as deleted
   */
  delete(): PlotEntity {
    const deletedPlot = new PlotEntity({
      id: this.id,
      name: this.name,
      description: this.description,
      dimensions: this.dimensions,
      status: this.status,
      soilType: this.soilType,
      soilPh: this.soilPh,
      farmId: this.farmId,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      deletedAt: new Date(),
    });
    deletedPlot.addDomainEvent(
      new PlotDeletedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: deletedPlot.id.value,
        occurredAt: deletedPlot.updatedAt.toISOString(),
      }),
    );
    return deletedPlot;
  }

  /**
   * Adds a domain event to the internal collection
   * @param event - The domain event to add
   */
  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Returns and clears all accumulated domain events
   * @returns The list of domain events
   */
  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.clearDomainEvents();
    return events;
  }

  /**
   * Clears all accumulated domain events
   */
  public clearDomainEvents(): void {
    (this.domainEvents as DomainEvent[]).length = 0;
  }

  /**
   * Converts the FarmEntity to its primitive representation
   */
  public toPrimitives(): PlotsPrimitive {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description,
      width: this.dimensions.getWidth(),
      length: this.dimensions.getLength(),
      height: this.dimensions.getHeight(),
      area: this.dimensions.getArea(),
      perimeter: this.dimensions.getPerimeter(),
      volume: this.dimensions.getVolume(),
      unitMeasurement: this.dimensions.getUnitMeasurement(),
      status: this.status.value,
      soilType: this.soilType,
      soilPh: this.soilPh,
      farmId: this.farmId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt?.toISOString(),
    };
  }

  /**
   * Reconstructs a FarmEntity from its primitive representation
   */
  public static fromPrimitives(primitive: PlotsPrimitive): PlotEntity {
    return new PlotEntity({
      id: new PlotIdValueObject(primitive.id),
      name: new PlotNameValueObject(primitive.name),
      description: primitive.description,
      dimensions: new PlotDimensionValueObject(
        primitive.width,
        primitive.length,
        primitive.height,
        primitive.unitMeasurement as UNIT_MEASUREMENT,
      ),
      status: new PlotStatusValueObject(primitive.status),
      soilType: primitive.soilType,
      soilPh: primitive.soilPh,
      farmId: primitive.farmId,
      createdAt: new Date(primitive.createdAt),
      updatedAt: new Date(primitive.updatedAt),
      deletedAt: primitive.deletedAt
        ? new Date(primitive.deletedAt)
        : undefined,
      emitEvent: false,
    });
  }

  calculateArea(width: number, length: number): number {
    return width * length;
  }

  calculatePerimeter(width: number, length: number): number {
    return 2 * (width + length);
  }
}
