import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * UserRegisteredDomainEvent
 *
 * Domain event emitted when a new user registers in the authentication system.
 * This event contains registration-specific information and can be used by other
 * bounded contexts to react to new user registrations.
 */
export class UserRegisteredDomainEvent implements DomainEvent {
  /** Unique event identifier */
  public readonly eventId: string;
  /** Aggregate root identifier (Auth entity ID) */
  public readonly aggregateId: string;
  /** Registered user identifier */
  public readonly userId: string;
  /** User email address */
  public readonly email: string;
  /** User first name */
  public readonly firstName?: string;
  /** User last name */
  public readonly lastName?: string;
  /** User bio */
  public readonly bio?: string;
  /** User avatar URL */
  public readonly avatar?: string;
  /** Registration metadata */
  public readonly registrationInfo: {
    /** IP address of the registration request */
    ipAddress?: string;
    /** User agent of the registration request */
    userAgent?: string;
    /** Registration source (web, mobile, api) */
    source: string;
  };
  /** ISO8601 timestamp of when the event occurred */
  public readonly occurredAt: string;
  /** Event version for schema evolution */
  public readonly version: number = 1;

  /**
   * Creates a new UserRegisteredDomainEvent
   *
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
    registrationInfo: {
      ipAddress?: string;
      userAgent?: string;
      source: string;
    };
    occurredAt: string;
    version?: number;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.userId = params.userId;
    this.email = params.email;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.bio = params.bio;
    this.avatar = params.avatar;
    this.registrationInfo = params.registrationInfo;
    this.occurredAt = params.occurredAt;
    this.version = params.version ?? 1;
  }
}
