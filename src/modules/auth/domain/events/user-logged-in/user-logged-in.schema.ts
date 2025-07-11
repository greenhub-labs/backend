import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * UserLoggedInDomainEvent V1 Schema
 * Defines the structure of the event payload for version 1
 * Emitted when a user successfully authenticates and logs into the system
 *
 * @author GreenHub Labs
 */
export interface UserLoggedInDomainEventV1Schema extends BaseDomainEventSchema {
  /** User email used for authentication */
  email: string;
  /** IP address from which the user logged in */
  ipAddress?: string;
  /** User agent string from the login request */
  userAgent?: string;
  /** Session identifier for tracking user session */
  sessionId?: string;
}
