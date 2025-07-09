/**
 * Base interface for all domain events (DDD)
 * Ensures all domain events have consistent metadata
 */
export interface DomainEvent {
  /** Unique event identifier */
  readonly eventId: string;
  /** Aggregate root identifier */
  readonly aggregateId: string;
  /** ISO8601 timestamp of when the event occurred */
  readonly occurredAt: string;
  /** Event version for schema evolution */
  readonly version: number;
}
