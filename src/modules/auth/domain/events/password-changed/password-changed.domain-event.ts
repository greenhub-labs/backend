import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * PasswordChangedDomainEvent
 *
 * Domain event emitted when a user changes their password.
 * This event is crucial for security monitoring, audit trails,
 * and triggering security-related notifications.
 */
export class PasswordChangedDomainEvent implements DomainEvent {
  /** Unique event identifier */
  public readonly eventId: string;
  /** Aggregate root identifier (Auth entity ID) */
  public readonly aggregateId: string;
  /** User identifier who changed password */
  public readonly userId: string;
  /** Password change metadata */
  public readonly passwordChangeInfo: {
    /** IP address of the password change request */
    ipAddress?: string;
    /** User agent of the password change request */
    userAgent?: string;
    /** Method used to change password (profile, reset, forced) */
    changeMethod: string;
    /** Whether the old password was verified before change */
    oldPasswordVerified: boolean;
    /** Indicates if this was a password reset (vs normal change) */
    isPasswordReset: boolean;
  };
  /** ISO8601 timestamp of when the event occurred */
  public readonly occurredAt: string;
  /** Event version for schema evolution */
  public readonly version: number = 1;

  /**
   * Creates a new PasswordChangedDomainEvent
   *
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    userId: string;
    passwordChangeInfo: {
      ipAddress?: string;
      userAgent?: string;
      changeMethod: string;
      oldPasswordVerified: boolean;
      isPasswordReset: boolean;
    };
    occurredAt: string;
    version?: number;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.userId = params.userId;
    this.passwordChangeInfo = params.passwordChangeInfo;
    this.occurredAt = params.occurredAt;
    this.version = params.version ?? 1;
  }
}
