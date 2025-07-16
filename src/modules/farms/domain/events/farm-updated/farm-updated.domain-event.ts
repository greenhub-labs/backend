import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * Domain event emitted when a Farm is updated.
 */
export class FarmUpdatedDomainEvent implements DomainEvent {
  /** Unique event identifier */
  readonly eventId: string;
  /** Aggregate (Farm) identifier */
  readonly aggregateId: string;
  /** Date and time when the event occurred (ISO string) */
  readonly occurredAt: string;
  /** Event version */
  readonly version: number = 1;

  /** Farm name */
  readonly name: string;
  /** Optional description */
  readonly description?: string;

  /**
   * Creates a new FarmUpdatedDomainEvent
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
