import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * Domain event emitted when a Farm is created.
 */
export class FarmCreatedDomainEvent implements DomainEvent {
  /** Unique event identifier */
  readonly eventId: string;
  /** Aggregate (Farm) identifier */
  readonly aggregateId: string;
  /** Date and time when the event occurred */
  readonly occurredAt: string;
  /** Event version */
  readonly version: number = 1;

  /** Farm name */
  readonly name: string;
  /** Optional description */
  readonly description?: string;

  /**
   * Creates a new FarmCreatedDomainEvent
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    occurredAt: string;
    name: string;
    description?: string;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.occurredAt = params.occurredAt;
    this.name = params.name;
    this.description = params.description;
  }
}
