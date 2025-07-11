import { BaseDomainEventSchema } from 'src/shared/domain/events/base-domain-event.schema';

/**
 * PasswordChangedDomainEvent V1 Schema
 *
 * Defines the structure of the event payload for version 1.
 * This schema is used for serialization/deserialization and ensures
 * backwards compatibility as the event evolves.
 */
export interface PasswordChangedDomainEventV1Schema
  extends BaseDomainEventSchema {
  /** User identifier who changed password */
  userId: string;
  /** Password change metadata */
  passwordChangeInfo: {
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
}
