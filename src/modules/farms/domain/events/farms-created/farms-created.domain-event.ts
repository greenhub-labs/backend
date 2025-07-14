import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * FarmsCreatedDomainEvent
 * Emitted when a new __name__ is created in the system.
 * You can add more properties as needed for your domain.
 */
export class FarmsCreatedDomainEvent implements DomainEvent {
  /** Unique event identifier */
  public readonly eventId: string;
  /** Aggregate root identifier */
  public readonly aggregateId: string;
  /** ISO8601 timestamp of when the event occurred */
  public readonly occurredAt: string;
  /** Event version for schema evolution */
  public readonly version: number;

  /**
   * Creates a new FarmsCreatedDomainEvent
   * @param params - Event properties (add more as needed)
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    occurredAt: string;
    version?: number;
    // Add more properties here if needed
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.occurredAt = params.occurredAt;
    this.version = params.version ?? 1;
    // Assign more properties here if needed
  }
} 