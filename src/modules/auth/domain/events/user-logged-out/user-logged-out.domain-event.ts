import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * UserLoggedOutDomainEvent
 *
 * Domain event emitted when a user logs out from the authentication system.
 * This event contains logout-specific information and can be used for security
 * monitoring, analytics, and session management.
 */
export class UserLoggedOutDomainEvent implements DomainEvent {
  /** Unique event identifier */
  public readonly eventId: string;
  /** Aggregate root identifier (Auth entity ID) */
  public readonly aggregateId: string;
  /** User identifier who logged out */
  public readonly userId: string;
  /** Logout metadata */
  public readonly logoutInfo: {
    /** Session ID that was terminated */
    sessionId?: string;
    /** IP address of the logout request */
    ipAddress?: string;
    /** User agent of the logout request */
    userAgent?: string;
    /** Logout method (manual, automatic, forced) */
    logoutMethod: string;
    /** Reason for logout (user_action, session_expired, security_logout) */
    reason?: string;
  };
  /** ISO8601 timestamp of when the event occurred */
  public readonly occurredAt: string;
  /** Event version for schema evolution */
  public readonly version: number = 1;

  /**
   * Creates a new UserLoggedOutDomainEvent
   *
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    userId: string;
    logoutInfo: {
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
      logoutMethod: string;
      reason?: string;
    };
    occurredAt: string;
    version?: number;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.userId = params.userId;
    this.logoutInfo = params.logoutInfo;
    this.occurredAt = params.occurredAt;
    this.version = params.version ?? 1;
  }
}
