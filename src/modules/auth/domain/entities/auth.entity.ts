import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { AuthEmailValueObject } from '../value-objects/auth-email/auth-email.value-object';
import { AuthPasswordValueObject } from '../value-objects/auth-password/auth-password.value-object';
import { UserLoggedInDomainEvent } from '../events/user-logged-in/user-logged-in.domain-event';
import { UserRegisteredDomainEvent } from '../events/user-registered/user-registered.domain-event';
import { UserLoggedOutDomainEvent } from '../events/user-logged-out/user-logged-out.domain-event';
import { PasswordChangedDomainEvent } from '../events/password-changed/password-changed.domain-event';
import { TokenRefreshedDomainEvent } from '../events/token-refreshed/token-refreshed.domain-event';
import { AuthPrimitive } from '../primitives/auth.primitive';

/**
 * Auth Entity (Aggregate Root)
 * Represents authentication data for a user in the domain (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
export class Auth {
  /** Unique auth identifier (UUID) */
  public readonly id: string;
  /** User identifier (UUID) this auth belongs to */
  public readonly userId: string;
  /** User email for authentication */
  public readonly email: AuthEmailValueObject;
  /** Hashed password */
  public readonly password: AuthPasswordValueObject;
  /** Phone number (optional) */
  public readonly phone?: string;
  /** Whether the email is verified */
  public readonly isVerified: boolean;
  /** Last login timestamp */
  public readonly lastLogin?: Date;
  /** Creation date */
  public readonly createdAt: Date;
  /** Last update date */
  public readonly updatedAt: Date;
  /** Deletion date (soft delete) */
  public readonly deletedAt?: Date;

  /**
   * Internal collection of domain events
   */
  private readonly domainEvents: DomainEvent[] = [];

  /**
   * Creates a new Auth entity
   * @param props Auth properties (value objects and primitives)
   */
  constructor(props: {
    id: string;
    userId: string;
    email: AuthEmailValueObject;
    password: AuthPasswordValueObject;
    phone?: string;
    isVerified: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    emitEvent?: boolean; // For fromPrimitives, avoid duplicate event
  }) {
    this.id = props.id;
    this.userId = props.userId;
    this.email = props.email;
    this.password = props.password;
    this.phone = props.phone;
    this.isVerified = props.isVerified;
    this.lastLogin = props.lastLogin;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  /**
   * Records a successful login and emits domain event
   * @param loginContext Additional context about the login
   */
  public recordLogin(loginContext: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  }): Auth {
    // Emit login event
    this.addDomainEvent(
      new UserLoggedInDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: this.userId,
        email: this.email.value,
        ipAddress: loginContext.ipAddress,
        userAgent: loginContext.userAgent,
        sessionId: loginContext.sessionId,
        occurredAt: new Date().toISOString(),
      }),
    );

    // Return new instance with updated lastLogin
    return new Auth({
      id: this.id,
      userId: this.userId,
      email: this.email,
      password: this.password,
      phone: this.phone,
      isVerified: this.isVerified,
      lastLogin: new Date(),
      createdAt: this.createdAt,
      updatedAt: new Date(),
      deletedAt: this.deletedAt,
      emitEvent: false,
    });
  }

  /**
   * Updates the password (hashed) and emits domain event
   * @param newPassword New hashed password
   * @param changeContext Additional context about the password change
   */
  public changePassword(
    newPassword: AuthPasswordValueObject,
    changeContext: {
      ipAddress?: string;
      userAgent?: string;
      changeMethod: string;
      oldPasswordVerified: boolean;
      isPasswordReset: boolean;
    },
  ): Auth {
    // Emit password changed event
    this.addDomainEvent(
      new PasswordChangedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: this.id,
        userId: this.userId,
        passwordChangeInfo: changeContext,
        occurredAt: new Date().toISOString(),
      }),
    );

    return new Auth({
      id: this.id,
      userId: this.userId,
      email: this.email,
      password: newPassword,
      phone: this.phone,
      isVerified: this.isVerified,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      deletedAt: this.deletedAt,
      emitEvent: false,
    });
  }

  /**
   * Records a user logout and emits domain event
   * @param logoutContext Additional context about the logout
   */
  public recordLogout(logoutContext: {
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    logoutMethod: string;
    reason?: string;
  }): void {
    // Emit logout event
    this.addDomainEvent(
      new UserLoggedOutDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: this.id,
        userId: this.userId,
        logoutInfo: logoutContext,
        occurredAt: new Date().toISOString(),
      }),
    );
  }

  /**
   * Records a token refresh and emits domain event
   * @param refreshContext Additional context about the token refresh
   */
  public recordTokenRefresh(refreshContext: {
    ipAddress?: string;
    userAgent?: string;
    previousTokenExpiry: string;
    newTokenExpiry: string;
    refreshTokenId?: string;
    isAutomatic: boolean;
  }): void {
    // Emit token refreshed event
    this.addDomainEvent(
      new TokenRefreshedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: this.id,
        userId: this.userId,
        tokenRefreshInfo: refreshContext,
        occurredAt: new Date().toISOString(),
      }),
    );
  }

  /**
   * Records a user registration and emits domain event
   * @param userInfo User registration information
   * @param registrationContext Additional context about the registration
   */
  public recordRegistration(
    userInfo: {
      firstName?: string;
      lastName?: string;
      bio?: string;
      avatar?: string;
    },
    registrationContext: {
      ipAddress?: string;
      userAgent?: string;
      source: string;
    },
  ): void {
    // Emit registration event
    this.addDomainEvent(
      new UserRegisteredDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: this.id,
        userId: this.userId,
        email: this.email.value,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        bio: userInfo.bio,
        avatar: userInfo.avatar,
        registrationInfo: registrationContext,
        occurredAt: new Date().toISOString(),
      }),
    );
  }

  /**
   * Verifies the email address
   */
  public verifyEmail(): Auth {
    return new Auth({
      id: this.id,
      userId: this.userId,
      email: this.email,
      password: this.password,
      phone: this.phone,
      isVerified: true,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      deletedAt: this.deletedAt,
      emitEvent: false,
    });
  }

  /**
   * Updates phone number
   * @param phone New phone number
   */
  public updatePhone(phone?: string): Auth {
    return new Auth({
      id: this.id,
      userId: this.userId,
      email: this.email,
      password: this.password,
      phone: phone,
      isVerified: this.isVerified,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      deletedAt: this.deletedAt,
      emitEvent: false,
    });
  }

  /**
   * Checks if this auth record is for the given email
   * @param email Email to check against
   */
  public isEmailMatching(email: string): boolean {
    return this.email.equals(new AuthEmailValueObject(email));
  }

  /**
   * Converts entity to primitive representation
   */
  public toPrimitives(): AuthPrimitive {
    return {
      id: this.id,
      userId: this.userId,
      email: this.email.value,
      password: this.password.value,
      phone: this.phone,
      isVerified: this.isVerified,
      lastLogin: this.lastLogin?.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt?.toISOString(),
    };
  }

  /**
   * Creates entity from primitive representation
   * @param primitives Primitive data
   */
  public static fromPrimitives(primitives: AuthPrimitive): Auth {
    return new Auth({
      id: primitives.id,
      userId: primitives.userId,
      email: new AuthEmailValueObject(primitives.email),
      password: AuthPasswordValueObject.fromHash(primitives.password),
      phone: primitives.phone,
      isVerified: primitives.isVerified,
      lastLogin: primitives.lastLogin
        ? new Date(primitives.lastLogin)
        : undefined,
      createdAt: new Date(primitives.createdAt),
      updatedAt: new Date(primitives.updatedAt),
      deletedAt: primitives.deletedAt
        ? new Date(primitives.deletedAt)
        : undefined,
      emitEvent: false, // Don't emit events when recreating from persistence
    });
  }

  /**
   * Adds a domain event to the internal collection
   * @param event Domain event to add
   */
  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Returns and clears all domain events
   */
  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0; // Clear the array
    return events;
  }

  /**
   * Returns domain events without clearing them
   */
  public getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }
}
