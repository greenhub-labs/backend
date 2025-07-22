import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { CropCreatedDomainEvent } from '../events/crop-created/crop-created.domain-event';
import { CropDeletedDomainEvent } from '../events/crop-deleted/crop-deleted.domain-event';
import { CropUpdatedDomainEvent } from '../events/crop-updated/crop-updated.domain-event';
import { CropPrimitive } from '../primitives/crop.primitive';
import { CropActualHarvestDateValueObject } from '../value-objects/crop-actual-harvest-date/crop-actual-harvest-date.value-object';
import { CropExpectedHarvestDateValueObject } from '../value-objects/crop-expected-harvest-date/crop-expected-harvest-date.value-object';
import { CropIdValueObject } from '../value-objects/crop-id/crop-id.value-object';
import { CropPlantingDateValueObject } from '../value-objects/crop-planting-date/crop-planting-date.value-object';
import { CropPlantingMethodValueObject } from '../value-objects/crop-planting-method/crop-planting-method.value-object';
import { CropStatusValueObject } from '../value-objects/crop-status/crop-status.value-object';

/**
 * Entity representing a Crop in the domain.
 */
export class CropEntity {
  /** Unique identifier of the crop */
  private readonly _id: CropIdValueObject;
  /** Name of the crop */
  private readonly _plotId: string;
  /** Variety ID */
  private readonly _varietyId: string;
  /** Planting date */
  private readonly _plantingDate: CropPlantingDateValueObject;
  /** Expected harvest */
  private readonly _expectedHarvest: CropExpectedHarvestDateValueObject;
  /** Actual harvest */
  private readonly _actualHarvest: CropActualHarvestDateValueObject;
  /** Quantity */
  private readonly _quantity: number;
  /** Status of the crop */
  private readonly _status: CropStatusValueObject;
  /** Planting method of the crop */
  private readonly _plantingMethod?: CropPlantingMethodValueObject;
  /** Notes of the crop */
  private readonly _notes: string;
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
    id: CropIdValueObject;
    plotId: string;
    varietyId: string;
    plantingDate: CropPlantingDateValueObject;
    expectedHarvest: CropExpectedHarvestDateValueObject;
    actualHarvest: CropActualHarvestDateValueObject;
    quantity: number;
    status: CropStatusValueObject;
    plantingMethod?: CropPlantingMethodValueObject;
    notes: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    emitEvent?: boolean; // For fromPrimitives, avoid duplicate event
  }) {
    this._id = params.id;
    this._plotId = params.plotId;
    this._varietyId = params.varietyId;
    this._plantingDate = params.plantingDate;
    this._expectedHarvest = params.expectedHarvest;
    this._actualHarvest = params.actualHarvest;
    this._quantity = params.quantity;
    this._status = params.status;
    this._plantingMethod = params.plantingMethod;
    this._notes = params.notes;
    this._createdAt = params.createdAt ?? new Date();
    this._updatedAt = params.updatedAt ?? new Date();
    this._deletedAt = params.deletedAt;
    // Emit event only if not restoring from persistence
    if (params.emitEvent !== false) {
      this.addDomainEvent(
        new CropCreatedDomainEvent({
          eventId: crypto.randomUUID(),
          aggregateId: this._id.value,
          occurredAt: this._createdAt.toISOString(),
          plotId: this._plotId,
          varietyId: this._varietyId,
          plantingDate: this._plantingDate?.toISOString(),
          expectedHarvest: this._expectedHarvest?.toISOString(),
          actualHarvest: this._actualHarvest?.toISOString(),
          quantity: this._quantity,
          status: this._status.value,
          plantingMethod: this._plantingMethod?.value,
          notes: this._notes,
        }),
      );
    }
  }

  /**
   * Gets the plot ID
   */
  get id(): CropIdValueObject {
    return this._id;
  }

  /**
   * Gets the plot ID
   */
  get plotId(): string {
    return this._plotId;
  }

  /**
   * Gets the variety ID
   */
  get varietyId(): string {
    return this._varietyId;
  }

  /**
   * Gets the planting date
   */
  get plantingDate(): CropPlantingDateValueObject {
    return this._plantingDate;
  }

  /**
   * Gets the expected harvest
   */
  get expectedHarvest(): CropExpectedHarvestDateValueObject {
    return this._expectedHarvest;
  }

  /**
   * Gets the actual harvest
   */
  get actualHarvest(): CropActualHarvestDateValueObject {
    return this._actualHarvest;
  }

  /**
   * Gets the quantity
   */
  get quantity(): number {
    return this._quantity;
  }

  /**
   * Gets the status
   */
  get status(): CropStatusValueObject {
    return this._status;
  }

  /**
   * Gets the planting method
   */
  get plantingMethod(): CropPlantingMethodValueObject | undefined {
    return this._plantingMethod;
  }

  /**
   * Gets the notes
   */
  get notes(): string {
    return this._notes;
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
   * Updates the crop with the given data (immutable) and emits CropUpdatedDomainEvent
   * @param data - The data to update the crop with
   * @returns A new CropEntity instance with the updated data
   */
  update(
    data: Partial<{
      plotId: string;
      varietyId: string;
      plantingDate: Date;
      expectedHarvest: Date;
      actualHarvest: Date;
      quantity: number;
      status: string;
      plantingMethod: string;
      notes: string;
    }>,
  ): CropEntity {
    const updatedCrop = new CropEntity({
      id: this._id,
      plotId: data.plotId ?? this._plotId,
      varietyId: data.varietyId ?? this._varietyId,
      plantingDate: data.plantingDate
        ? new CropPlantingDateValueObject(data.plantingDate)
        : this._plantingDate,
      expectedHarvest: data.expectedHarvest
        ? new CropExpectedHarvestDateValueObject(data.expectedHarvest)
        : this._expectedHarvest,
      actualHarvest: data.actualHarvest
        ? new CropActualHarvestDateValueObject(data.actualHarvest)
        : this._actualHarvest,
      quantity: data.quantity ?? this._quantity,
      status: data.status
        ? new CropStatusValueObject(data.status)
        : this._status,
      plantingMethod: data.plantingMethod
        ? new CropPlantingMethodValueObject(data.plantingMethod)
        : this._plantingMethod,
      notes: data.notes ?? this._notes,
      createdAt: this._createdAt,
      updatedAt: new Date(),
      deletedAt: this._deletedAt,
      emitEvent: false,
    });
    updatedCrop.addDomainEvent(
      new CropUpdatedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: updatedCrop._id.value,
        occurredAt: updatedCrop._updatedAt.toISOString(),
        plantingDate: updatedCrop._plantingDate
          ? updatedCrop._plantingDate.toISOString()
          : undefined,
        expectedHarvest: updatedCrop._expectedHarvest
          ? updatedCrop._expectedHarvest.toISOString()
          : undefined,
        actualHarvest: updatedCrop._actualHarvest
          ? updatedCrop._actualHarvest.toISOString()
          : undefined,
        quantity: updatedCrop._quantity,
        status: updatedCrop._status.value,
        plantingMethod: updatedCrop._plantingMethod?.value,
        notes: updatedCrop._notes,
      }),
    );
    return updatedCrop;
  }

  /**
   * Marks the plot as deleted (soft delete) and emits PlotDeletedDomainEvent
   * @returns A new PlotEntity instance marked as deleted
   */
  delete(): CropEntity {
    const deletedCrop = new CropEntity({
      id: this._id,
      plotId: this._plotId,
      varietyId: this._varietyId,
      plantingDate: this._plantingDate,
      expectedHarvest: this._expectedHarvest,
      actualHarvest: this._actualHarvest,
      quantity: this._quantity,
      status: this._status,
      plantingMethod: this._plantingMethod,
      notes: this._notes,
      createdAt: this._createdAt,
      updatedAt: new Date(),
      deletedAt: new Date(),
      emitEvent: false,
    });
    deletedCrop.addDomainEvent(
      new CropDeletedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: deletedCrop._id.value,
        occurredAt: deletedCrop._updatedAt.toISOString(),
      }),
    );
    return deletedCrop;
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
  public toPrimitives(): CropPrimitive {
    return {
      id: this._id.value,
      plotId: this._plotId,
      varietyId: this._varietyId,
      plantingDate: this._plantingDate
        ? this._plantingDate.toISOString()
        : undefined,
      expectedHarvest: this._expectedHarvest
        ? this._expectedHarvest.toISOString()
        : undefined,
      actualHarvest: this._actualHarvest
        ? this._actualHarvest.toISOString()
        : undefined,
      quantity: this._quantity,
      status: this._status.value,
      plantingMethod: this._plantingMethod?.value,
      notes: this._notes,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      deletedAt: this._deletedAt?.toISOString(),
    };
  }
}
