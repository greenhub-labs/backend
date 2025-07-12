import { IntegrationEvent } from 'src/shared/application/events/integration-event.interface';

/**
 * UserRegisteredIntegrationEvent
 *
 * Integration event published when a user registers, for external systems (audit, analytics, etc).
 * This event is stable and decoupled from the internal domain event.
 */
export class UserRegisteredIntegrationEvent implements IntegrationEvent {
  /** Unique integration event identifier */
  readonly eventId: string;
  /** User ID (aggregateId) */
  readonly aggregateId: string;
  /** ISO8601 timestamp of when the event occurred */
  readonly occurredAt: string;
  /** Event version for schema evolution */
  readonly version: number = 1;
  /** Event type (optional) */
  readonly eventType?: string = 'UserRegisteredIntegrationEvent';

  /** User email used for login */
  readonly email: string;
  /** IP address from which the user logged in */
  readonly ipAddress?: string;
  /** User agent string from the login request */
  readonly userAgent?: string;
  /** Session identifier */
  readonly sessionId?: string;

  /**
   * Creates a new UserRegisteredIntegrationEvent
   * @param params - Event properties
   */
  constructor(params: {
    eventId: string;
    aggregateId: string;
    occurredAt: string;
    email: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    version?: number;
    eventType?: string;
  }) {
    this.eventId = params.eventId;
    this.aggregateId = params.aggregateId;
    this.occurredAt = params.occurredAt;
    this.version = params.version ?? 1;
    this.eventType = params.eventType ?? 'UserRegisteredIntegrationEvent';
    this.email = params.email;
    this.ipAddress = params.ipAddress;
    this.userAgent = params.userAgent;
    this.sessionId = params.sessionId;
  }
}
