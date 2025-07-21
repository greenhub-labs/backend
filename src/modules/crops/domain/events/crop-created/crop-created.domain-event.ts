import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * Domain event emitted when a Crop is created.
 */
export class CropCreatedDomainEvent implements DomainEvent {
  /** Unique event identifier */
  readonly eventId: string;
  /** Aggregate (Crop) identifier */
  readonly aggregateId: string;
  /** Date and time when the event occurred */
  readonly occurredAt: string;
  /** Event version */
  readonly version: number = 1;

  /** Plot ID */
  readonly plotId: string;
  /** Variety ID */
  readonly varietyId: string;
  /** Planting date */
  readonly plantingDate: string;
  /** Expected harvest */
  readonly expectedHarvest: string;
  /** Actual harvest */
  readonly actualHarvest: string;
  /** Quantity */
  readonly quantity: number;
  /** Status */
  readonly status: string;
  /** Planting method */
  readonly plantingMethod: string;
  /** Notes */
  readonly notes: string;

  /**
   * Creates a new PlotCreatedDomainEvent
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    occurredAt: string;
    plotId: string;
    varietyId: string;
    plantingDate: string;
    expectedHarvest: string;
    actualHarvest: string;
    quantity: number;
    status?: string;
    plantingMethod?: string;
    notes?: string;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.occurredAt = params.occurredAt;
    this.plotId = params.plotId;
    this.varietyId = params.varietyId;
    this.plantingDate = params.plantingDate;
    this.expectedHarvest = params.expectedHarvest;
    this.actualHarvest = params.actualHarvest;
    this.quantity = params.quantity;
    this.status = params.status;
    this.plantingMethod = params.plantingMethod;
    this.notes = params.notes;
  }
}
