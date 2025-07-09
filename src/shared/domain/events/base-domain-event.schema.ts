/**
 * BaseDomainEventSchema
 * Defines the common structure for all domain event schemas
 */
export interface BaseDomainEventSchema {
  /** Unique event identifier */
  eventId: string;
  /** Aggregate root identifier */
  aggregateId: string;
  /** ISO8601 timestamp of when the event occurred */
  occurredAt: string;
  /** Event version for schema evolution */
  version: number;
}
