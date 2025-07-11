import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * UserLoggedOutDomainEvent V1 Schema
 *
 * Defines the structure of the event payload for version 1.
 * This schema is used for serialization/deserialization and ensures
 * backwards compatibility as the event evolves.
 */
export interface UserLoggedOutDomainEventV1Schema
  extends BaseDomainEventSchema {
  /** User identifier who logged out */
  userId: string;
  /** Logout metadata */
  logoutInfo: {
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
}
