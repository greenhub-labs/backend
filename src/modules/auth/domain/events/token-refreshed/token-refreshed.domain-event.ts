import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';

/**
 * TokenRefreshedDomainEvent
 *
 * Domain event emitted when a user's authentication tokens are refreshed.
 * This event is useful for session monitoring, security analytics,
 * and tracking user activity patterns.
 */
export class TokenRefreshedDomainEvent implements DomainEvent {
  /** Unique event identifier */
  public readonly eventId: string;
  /** Aggregate root identifier (Auth entity ID) */
  public readonly aggregateId: string;
  /** User identifier who refreshed tokens */
  public readonly userId: string;
  /** Token refresh metadata */
  public readonly tokenRefreshInfo: {
    /** IP address of the token refresh request */
    ipAddress?: string;
    /** User agent of the token refresh request */
    userAgent?: string;
    /** Previous token expiration timestamp */
    previousTokenExpiry: string;
    /** New token expiration timestamp */
    newTokenExpiry: string;
    /** Refresh token that was used */
    refreshTokenId?: string;
    /** Whether the refresh was automatic or manual */
    isAutomatic: boolean;
  };
  /** ISO8601 timestamp of when the event occurred */
  public readonly occurredAt: string;
  /** Event version for schema evolution */
  public readonly version: number = 1;

  /**
   * Creates a new TokenRefreshedDomainEvent
   *
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    userId: string;
    tokenRefreshInfo: {
      ipAddress?: string;
      userAgent?: string;
      previousTokenExpiry: string;
      newTokenExpiry: string;
      refreshTokenId?: string;
      isAutomatic: boolean;
    };
    occurredAt: string;
    version?: number;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.userId = params.userId;
    this.tokenRefreshInfo = params.tokenRefreshInfo;
    this.occurredAt = params.occurredAt;
    this.version = params.version ?? 1;
  }
}
