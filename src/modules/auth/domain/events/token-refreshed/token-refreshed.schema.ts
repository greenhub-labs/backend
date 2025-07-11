import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * TokenRefreshedDomainEvent V1 Schema
 *
 * Defines the structure of the event payload for version 1.
 * This schema is used for serialization/deserialization and ensures
 * backwards compatibility as the event evolves.
 */
export interface TokenRefreshedDomainEventV1Schema
  extends BaseDomainEventSchema {
  /** User identifier who refreshed tokens */
  userId: string;
  /** Token refresh metadata */
  tokenRefreshInfo: {
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
}
