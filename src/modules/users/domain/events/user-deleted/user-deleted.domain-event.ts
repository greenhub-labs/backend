import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * UserDeletedDomainEvent
 * Emitted when a user is deleted in the system
 */
export class UserDeletedDomainEvent implements DomainEvent {
  /** Unique event identifier */
  public readonly eventId: string;
  /** Aggregate root identifier (userId) */
  public readonly aggregateId: string;
  /** ISO8601 timestamp of when the event occurred */
  public readonly occurredAt: string;
  /** Event version for schema evolution */
  public readonly version: number = 1;

  /**
   * Creates a new UserDeletedDomainEvent
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    occurredAt: string;
    version?: number;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.occurredAt = params.occurredAt;
    this.version = params.version ?? 1;
  }
}
