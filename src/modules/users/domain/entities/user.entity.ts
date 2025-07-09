import { UserIdValueObject } from '../value-objects/user-id/user-id.value-object';
import { UserNameValueObject } from '../value-objects/user-name/user-name.value-object';
import { UserAvatarUrlValueObject } from '../value-objects/user-avatar-url/user-avatar-url.value-object';
import { UserPrimitive } from '../primitives/user.primitive';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { UserCreatedDomainEvent } from '../events/user-created/user-created.domain-event';
import { UserUpdatedDomainEvent } from '../events/user-updated/user-updated.domain-event';
import { UserDeletedDomainEvent } from '../events/user-deleted/user-deleted.domain-event';

/**
 * User Entity (Aggregate Root)
 * Represents a system user in the domain (DDD Clean Architecture)
 *
 * @author GreenHub Labs
 */
export class User {
  /** Unique user identifier (UUID) */
  public readonly id: UserIdValueObject;
  /** First name (optional) */
  public readonly firstName?: UserNameValueObject;
  /** Last name (optional) */
  public readonly lastName?: UserNameValueObject;
  /** User bio or description */
  public readonly bio?: string;
  /** Avatar URL (optional) */
  public readonly avatar?: UserAvatarUrlValueObject;
  /** Whether the user is active */
  public readonly isActive: boolean;
  /** Soft delete flag */
  public readonly isDeleted: boolean;
  /** Creation date */
  public readonly createdAt: Date;
  /** Last update date */
  public readonly updatedAt: Date;
  /** Deletion date */
  public readonly deletedAt?: Date;

  /**
   * Internal collection of domain events
   */
  private readonly domainEvents: DomainEvent[] = [];

  /**
   * Creates a new User entity and emits UserCreatedDomainEvent
   * @param props User properties (value objects and primitives)
   */
  constructor(props: {
    id: UserIdValueObject;
    firstName?: UserNameValueObject;
    lastName?: UserNameValueObject;
    bio?: string;
    avatar?: UserAvatarUrlValueObject;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    emitEvent?: boolean; // For fromPrimitives, avoid duplicate event
  }) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.bio = props.bio;
    this.avatar = props.avatar;
    this.isActive = props.isActive;
    this.isDeleted = props.isDeleted;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    // Emit event only if not restoring from persistence
    if (props.emitEvent !== false) {
      this.addDomainEvent(
        new UserCreatedDomainEvent({
          eventId: crypto.randomUUID(),
          aggregateId: this.id.value,
          firstName: this.firstName?.value,
          lastName: this.lastName?.value,
          bio: this.bio,
          avatar: this.avatar?.value,
          occurredAt: this.createdAt.toISOString(),
        }),
      );
    }
  }

  /**
   * Updates the user with the given data (immutable) and emits UserUpdatedDomainEvent
   * @param data - The data to update the user with
   * @returns A new User instance with the updated data
   */
  update(
    data: Partial<{
      firstName: string;
      lastName: string;
      avatar: string;
      bio: string;
    }>,
  ): User {
    const updatedUser = new User({
      id: this.id,
      firstName: data.firstName
        ? new UserNameValueObject(data.firstName)
        : this.firstName,
      lastName: data.lastName
        ? new UserNameValueObject(data.lastName)
        : this.lastName,
      avatar: data.avatar
        ? new UserAvatarUrlValueObject(data.avatar)
        : this.avatar,
      bio: data.bio ?? this.bio,
      isActive: this.isActive,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
    updatedUser.addDomainEvent(
      new UserUpdatedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: updatedUser.id.value,
        firstName: updatedUser.firstName?.value,
        lastName: updatedUser.lastName?.value,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar?.value,
        occurredAt: updatedUser.updatedAt.toISOString(),
      }),
    );
    return updatedUser;
  }

  /**
   * Marks the user as deleted (soft delete) and emits UserDeletedDomainEvent
   * @returns A new User instance marked as deleted
   */
  delete(): User {
    const deletedUser = new User({
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      bio: this.bio,
      isActive: this.isActive,
      isDeleted: true,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
    deletedUser.addDomainEvent(
      new UserDeletedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: deletedUser.id.value,
        occurredAt: deletedUser.updatedAt.toISOString(),
      }),
    );
    return deletedUser;
  }

  /**
   * Adds a domain event to the internal collection
   * @param event - The domain event to add
   */
  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  /**
   * Returns and clears all accumulated domain events
   * @returns The list of domain events
   */
  public pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.clearDomainEvents();
    return events;
  }

  /**
   * Clears all accumulated domain events
   */
  public clearDomainEvents(): void {
    (this.domainEvents as DomainEvent[]).length = 0;
  }

  /**
   * Converts the User instance to a primitive object
   * @returns A primitive object
   */
  toPrimitives(): UserPrimitive {
    return {
      id: this.id.value,
      firstName: this.firstName?.value,
      lastName: this.lastName?.value,
      bio: this.bio,
      avatar: this.avatar?.value,
      isActive: this.isActive,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt?.toISOString(),
    };
  }
}
