import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * UserRegisteredDomainEvent V1 Schema
 *
 * Defines the structure of the event payload for version 1.
 * This schema is used for serialization/deserialization and ensures
 * backwards compatibility as the event evolves.
 */
export interface UserRegisteredDomainEventV1Schema
  extends BaseDomainEventSchema {
  /** Registered user identifier */
  userId: string;
  /** User email address */
  email: string;
  /** User first name */
  firstName?: string;
  /** User last name */
  lastName?: string;
  /** User bio */
  bio?: string;
  /** User avatar URL */
  avatar?: string;
  /** Registration metadata */
  registrationInfo: {
    /** IP address of the registration request */
    ipAddress?: string;
    /** User agent of the registration request */
    userAgent?: string;
    /** Registration source (web, mobile, api) */
    source: string;
  };
}
