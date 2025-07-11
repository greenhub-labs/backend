import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * UserLoggedInDomainEvent
 * Emitted when a user successfully logs into the system
 *
 * @author GreenHub Labs
 */
export class UserLoggedInDomainEvent implements DomainEvent {
  /** Unique event identifier */
  public readonly eventId: string;
  /** Aggregate root identifier (userId) */
  public readonly aggregateId: string;
  /** User email used for login */
  public readonly email: string;
  /** IP address from which the user logged in */
  public readonly ipAddress?: string;
  /** User agent string from the login request */
  public readonly userAgent?: string;
  /** Session identifier */
  public readonly sessionId?: string;
  /** ISO8601 timestamp of when the event occurred */
  public readonly occurredAt: string;
  /** Event version for schema evolution */
  public readonly version: number = 1;

  /**
   * Creates a new UserLoggedInDomainEvent
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    email: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    occurredAt: string;
    version?: number;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.email = params.email;
    this.ipAddress = params.ipAddress;
    this.userAgent = params.userAgent;
    this.sessionId = params.sessionId;
    this.occurredAt = params.occurredAt;
    this.version = params.version ?? 1;
  }
}
