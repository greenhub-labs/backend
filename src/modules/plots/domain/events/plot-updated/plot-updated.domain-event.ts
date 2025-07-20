import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';

/**
 * Domain event emitted when a Plot is updated.
 */
export class PlotUpdatedDomainEvent implements DomainEvent {
  /** Unique event identifier */
  readonly eventId: string;
  /** Aggregate (Plot) identifier */
  readonly aggregateId: string;
  /** Date and time when the event occurred (ISO string) */
  readonly occurredAt: string;
  /** Event version */
  readonly version: number = 1;

  /** Plot name */
  readonly name: string;
  /** Optional description */
  readonly description?: string;
  /** Width of the plot */
  readonly width: number;
  /** Length of the plot */
  readonly length: number;
  /** Height of the plot */
  readonly height: number;
  /** Area of the plot */
  readonly area: number;
  /** Perimeter of the plot */
  readonly perimeter: number;
  /** Volume of the plot */
  readonly volume: number;
  /** Unit measurement of the plot */
  readonly unitMeasurement: UNIT_MEASUREMENT;
  /** Status of the plot */
  readonly status: string;
  /** Soil type of the plot */
  readonly soilType: string;
  /** Soil pH of the plot */
  readonly soilPh: number;
  /** Farm ID */
  readonly farmId: string;

  /**
   * Creates a new PlotUpdatedDomainEvent
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    occurredAt: string;
    name: string;
    description?: string;
    width?: number;
    length?: number;
    height?: number;
    area?: number;
    perimeter?: number;
    volume?: number;
    unitMeasurement?: UNIT_MEASUREMENT;
    status?: string;
    soilType?: string;
    soilPh?: number;
    farmId?: string;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.occurredAt = params.occurredAt;
    this.name = params.name;
    this.description = params.description;
    this.width = params.width;
    this.length = params.length;
    this.height = params.height;
    this.area = params.area;
    this.perimeter = params.perimeter;
    this.volume = params.volume;
    this.unitMeasurement = params.unitMeasurement;
    this.status = params.status;
    this.soilType = params.soilType;
    this.soilPh = params.soilPh;
    this.farmId = params.farmId;
  }
}
