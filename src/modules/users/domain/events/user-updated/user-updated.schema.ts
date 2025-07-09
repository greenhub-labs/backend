import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * UserUpdatedDomainEvent V1 Schema
 * Defines the structure of the event payload for version 1
 */
export interface UserUpdatedDomainEventV1Schema extends BaseDomainEventSchema {
  /** User first name */
  firstName?: string;
  /** User last name */
  lastName?: string;
  /** User bio */
  bio?: string;
  /** User avatar URL */
  avatar?: string;
}
