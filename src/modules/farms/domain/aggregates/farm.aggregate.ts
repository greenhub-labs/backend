import { FarmEntity } from '../entities/farm.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserIdValueObject } from 'src/modules/users/domain/value-objects/user-id/user-id.value-object';
import { UserAssignedToFarmDomainEvent } from '../events/user-assigned-to-farm/user-assigned-to-farm.domain-event';
import { FarmsPrimitive } from '../primitives/farm.primitive';
import { FarmAddressValueObject } from '../value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from '../value-objects/farm-coordinates/farm-coordinates.value-object';
import { FarmIdValueObject } from '../value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from '../value-objects/farm-name/farm-name.value-object';
import { FARM_MEMBERSHIP_ROLES } from '../../../../shared/domain/constants/farm-membership-roles.constant';
import { UserNameValueObject } from 'src/modules/users/domain/value-objects/user-name/user-name.value-object';

/**
 * Aggregate root for the Farm domain.
 * Coordinates all changes and invariants for the Farm and its entities.
 */
export class FarmAggregate extends FarmEntity {
  /** Users assigned to this farm (populated externally) */
  private _members: User[] = [];

  /**
   * Gets the users assigned to this farm
   */
  get members(): User[] {
    return this._members;
  }

  /**
   * Sets the users assigned to this farm
   * @param users - Array of User entities
   */
  setMembers(users: User[]): void {
    this._members = users;
  }

  /**
   * Assigns a user to the farm and emits a domain event.
   * @param userId - The user to assign
   * @param role - The role to assign
   */
  assignUser(userId: string, role: FARM_MEMBERSHIP_ROLES): void {
    this.addDomainEvent(
      new UserAssignedToFarmDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: this.id.value,
        userId: userId,
        role: role,
        occurredAt: new Date().toISOString(),
      }),
    );
  }

  static fromPrimitives(primitive: FarmsPrimitive): FarmAggregate {
    return new FarmAggregate({
      id: new FarmIdValueObject(primitive.id),
      name: new FarmNameValueObject(primitive.name),
      description: primitive.description,
      address: new FarmAddressValueObject({
        country: primitive.country,
        state: primitive.state,
        city: primitive.city,
        postalCode: primitive.postalCode,
        street: primitive.street,
      }),
      coordinates: new FarmCoordinatesValueObject({
        latitude: primitive.latitude,
        longitude: primitive.longitude,
      }),
      isActive: primitive.isActive,
      createdAt: new Date(primitive.createdAt),
      updatedAt: new Date(primitive.updatedAt),
      deletedAt: primitive.deletedAt
        ? new Date(primitive.deletedAt)
        : undefined,
    });
  }

  /**
   * Example method to register a domain event when the farm is created.
   */
  farmCreated(): void {
    // this.domainEvents.push(new FarmCreatedDomainEvent(this.id, ...));
    // Implement domain event logic here
  }

  // Add more aggregate-specific logic and invariants here
}
