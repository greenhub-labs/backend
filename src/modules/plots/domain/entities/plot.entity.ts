import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { PlotCreatedDomainEvent } from '../events/plot-created/plot-created.domain-event';
import { PlotDeletedDomainEvent } from '../events/plot-deleted/plot-deleted.domain-event';
import { PlotUpdatedDomainEvent } from '../events/plot-updated/plot-updated.domain-event';
import { PlotsPrimitive } from '../primitives/plot.primitive';
import { PlotDimensionValueObject } from '../value-objects/plot-dimension/plot-dimension.value-object';
import { PlotIdValueObject } from '../value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from '../value-objects/plot-name/plot-name.value-object';
import { PlotSoilTypeValueObject } from '../value-objects/plot-soil-type/plot-soil-type.value-object';
import { PlotStatusValueObject } from '../value-objects/plot-status/plot-status.value-object';

/**
 * Entity representing a Plot in the domain.
 */
export class PlotEntity {
  /** Unique identifier of the plot */
  private readonly _id: PlotIdValueObject;
  /** Name of the plot */
  private readonly _name: PlotNameValueObject;
  /** Optional description of the plot */
  private readonly _description?: string;
  /** Dimensions of the plot */
  private readonly _dimensions: PlotDimensionValueObject;
  /** Status of the plot */
  private readonly _status: PlotStatusValueObject;
  /** Soil type of the plot */
  private readonly _soilType?: PlotSoilTypeValueObject;
  /** Soil pH of the plot */
  private readonly _soilPh: number;
  /** Farm ID */
  private readonly _farmId: string;
  /** Creation date */
  private readonly _createdAt: Date;
  /** Last update date */
  private readonly _updatedAt: Date;
  /** Soft delete date */
  private readonly _deletedAt?: Date;

  /**
   * Internal collection of domain events
   */
  private readonly domainEvents: DomainEvent[] = [];

  /**
   * Creates a new PlotEntity and emits PlotCreatedDomainEvent
   * @param params - Plot entity properties
   */
  constructor(params: {
    id: PlotIdValueObject;
    name: PlotNameValueObject;
    description?: string;
    dimensions: PlotDimensionValueObject;
    status: PlotStatusValueObject;
    soilType?: PlotSoilTypeValueObject;
    soilPh: number;
    farmId: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    emitEvent?: boolean; // For fromPrimitives, avoid duplicate event
  }) {
    this._id = params.id;
    this._name = params.name;
    this._description = params.description;
    this._dimensions = params.dimensions;
    this._status = params.status;
    this._soilType = params.soilType;
    this._soilPh = params.soilPh;
    this._farmId = params.farmId;
    this._createdAt = params.createdAt ?? new Date();
    this._updatedAt = params.updatedAt ?? new Date();
    this._deletedAt = params.deletedAt;
    // Emit event only if not restoring from persistence
    if (params.emitEvent !== false) {
      this.addDomainEvent(
        new PlotCreatedDomainEvent({
          eventId: crypto.randomUUID(),
          aggregateId: this._id.value,
          occurredAt: this._createdAt.toISOString(),
          name: this._name.value,
          description: this._description,
          width: this._dimensions.width,
          length: this._dimensions.length,
          height: this._dimensions.height,
          area: this._dimensions.area,
          perimeter: this._dimensions.perimeter,
          volume: this._dimensions.volume,
          unitMeasurement: this._dimensions.unitMeasurement,
          status: this._status.value,
          soilType: this._soilType?.value,
          soilPh: this._soilPh,
          farmId: this._farmId,
        }),
      );
    }
  }

  /**
   * Gets the plot ID
   */
  get id(): PlotIdValueObject {
    return this._id;
  }

  /**
   * Gets the plot name
   */
  get name(): PlotNameValueObject {
    return this._name;
  }

  /**
   * Gets the plot description
   */
  get description(): string | undefined {
    return this._description;
  }

  /**
   * Gets the plot dimensions
   */
  get dimensions(): PlotDimensionValueObject {
    return this._dimensions;
  }

  /**
   * Gets the plot status
   */
  get status(): PlotStatusValueObject {
    return this._status;
  }

  /**
   * Gets the soil type
   */
  get soilType(): PlotSoilTypeValueObject | undefined {
    return this._soilType;
  }

  /**
   * Gets the soil pH
   */
  get soilPh(): number {
    return this._soilPh;
  }

  /**
   * Gets the farm ID
   */
  get farmId(): string {
    return this._farmId;
  }

  /**
   * Gets the creation date
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Gets the last update date
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Gets the deletion date
   */
  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  /**
   * Checks if the plot is deleted
   */
  get isDeleted(): boolean {
    return this._deletedAt !== undefined;
  }

  /**
   * Updates the plot with the given data (immutable) and emits PlotUpdatedDomainEvent
   * @param data - The data to update the plot with
   * @returns A new PlotEntity instance with the updated data
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
      id: this._id,
      name: data.name ? new PlotNameValueObject(data.name) : this._name,
      description: data.description ?? this._description,
      dimensions: new PlotDimensionValueObject(
        data.width ?? this._dimensions.width,
        data.length ?? this._dimensions.length,
        data.height ?? this._dimensions.height,
        data.unitMeasurement ?? this._dimensions.unitMeasurement,
      ),
      status: data.status
        ? new PlotStatusValueObject(data.status)
        : this._status,
      soilType: data.soilType
        ? new PlotSoilTypeValueObject(data.soilType)
        : this._soilType,
      soilPh: data.soilPh ?? this._soilPh,
      farmId: data.farmId ?? this._farmId,
      createdAt: this._createdAt,
      updatedAt: new Date(),
      deletedAt: this._deletedAt,
    });
    updatedPlot.addDomainEvent(
      new PlotUpdatedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: updatedPlot._id.value,
        occurredAt: updatedPlot._updatedAt.toISOString(),
        name: updatedPlot._name.value,
        description: updatedPlot._description,
        width: updatedPlot._dimensions.width,
        length: updatedPlot._dimensions.length,
        height: updatedPlot._dimensions.height,
        area: updatedPlot._dimensions.area,
        perimeter: updatedPlot._dimensions.perimeter,
        volume: updatedPlot._dimensions.volume,
        unitMeasurement: updatedPlot._dimensions.unitMeasurement,
        status: updatedPlot._status.value,
        soilType: updatedPlot._soilType?.value,
        soilPh: updatedPlot._soilPh,
        farmId: updatedPlot._farmId,
      }),
    );
    return updatedPlot;
  }

  /**
   * Marks the plot as deleted (soft delete) and emits PlotDeletedDomainEvent
   * @returns A new PlotEntity instance marked as deleted
   */
  delete(): PlotEntity {
    const deletedPlot = new PlotEntity({
      id: this._id,
      name: this._name,
      description: this._description,
      dimensions: this._dimensions,
      status: this._status,
      soilType: this._soilType,
      soilPh: this._soilPh,
      farmId: this._farmId,
      createdAt: this._createdAt,
      updatedAt: new Date(),
      deletedAt: new Date(),
    });
    deletedPlot.addDomainEvent(
      new PlotDeletedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: deletedPlot._id.value,
        occurredAt: deletedPlot._updatedAt.toISOString(),
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
   * Converts the PlotEntity to its primitive representation
   */
  public toPrimitives(): PlotsPrimitive {
    return {
      id: this._id.value,
      name: this._name.value,
      description: this._description,
      width: this._dimensions.width,
      length: this._dimensions.length,
      height: this._dimensions.height,
      area: this._dimensions.area,
      perimeter: this._dimensions.perimeter,
      volume: this._dimensions.volume,
      unitMeasurement: this._dimensions.unitMeasurement,
      status: this._status.value,
      soilType: this._soilType?.value,
      soilPh: this._soilPh,
      farmId: this._farmId,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      deletedAt: this._deletedAt?.toISOString(),
    };
  }

  /**
   * Reconstructs a PlotEntity from its primitive representation
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
      soilType: primitive.soilType
        ? new PlotSoilTypeValueObject(primitive.soilType)
        : undefined,
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
}
