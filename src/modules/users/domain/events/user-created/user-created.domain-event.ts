import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * UserCreatedDomainEvent
 * Emitted when a new user is created in the system
 */
export class UserCreatedDomainEvent implements DomainEvent {
  /** Unique event identifier */
  public readonly eventId: string;
  /** Aggregate root identifier (userId) */
  public readonly aggregateId: string;
  /** User first name */
  public readonly firstName?: string;
  /** User last name */
  public readonly lastName?: string;
  /** User bio */
  public readonly bio?: string;
  /** User avatar URL */
  public readonly avatar?: string;
  /** ISO8601 timestamp of when the event occurred */
  public readonly occurredAt: string;
  /** Event version for schema evolution */
  public readonly version: number = 1;

  /**
   * Creates a new UserCreatedDomainEvent
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
    occurredAt: string;
    version?: number;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.bio = params.bio;
    this.avatar = params.avatar;
    this.occurredAt = params.occurredAt;
    this.version = params.version ?? 1;
  }
}
