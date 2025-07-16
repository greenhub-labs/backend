import { FarmIdValueObject } from '../value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from '../value-objects/farm-name/farm-name.value-object';
import { FarmAddressValueObject } from '../value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from '../value-objects/farm-coordinates/farm-coordinates.value-object';
import { DomainEvent } from 'src/shared/domain/events/domain-event.interface';
import { FarmCreatedDomainEvent } from '../events/farm-created/farm-created.domain-event';
import { FarmUpdatedDomainEvent } from '../events/farm-updated/farm-updated.domain-event';
import { FarmDeletedDomainEvent } from '../events/farm-deleted/farm-deleted.domain-event';
import { FarmsPrimitive } from '../primitives/farm.primitive';

/**
 * Entity representing a Farm in the domain.
 */
export class FarmEntity {
  /** Unique identifier of the farm */
  readonly id: FarmIdValueObject;
  /** Name of the farm */
  name: FarmNameValueObject;
  /** Optional description of the farm */
  description?: string;
  /** Address value object */
  address: FarmAddressValueObject;
  /** Coordinates value object */
  coordinates: FarmCoordinatesValueObject;
  /** Whether the farm is active */
  isActive: boolean;
  /** Creation date */
  readonly createdAt: Date;
  /** Last update date */
  updatedAt: Date;
  /** Soft delete date */
  deletedAt?: Date;

  /**
   * Internal collection of domain events
   */
  private readonly domainEvents: DomainEvent[] = [];

  /**
   * Creates a new FarmEntity and emits FarmCreatedDomainEvent
   * @param params - Farm entity properties
   */
  constructor(params: {
    id: FarmIdValueObject;
    name: FarmNameValueObject;
    description?: string;
    address: FarmAddressValueObject;
    coordinates: FarmCoordinatesValueObject;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    emitEvent?: boolean; // For fromPrimitives, avoid duplicate event
  }) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.address = params.address;
    this.coordinates = params.coordinates;
    this.isActive = params.isActive ?? true;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt;
    // Emit event only if not restoring from persistence
    if (params.emitEvent !== false) {
      this.addDomainEvent(
        new FarmCreatedDomainEvent({
          eventId: crypto.randomUUID(),
          aggregateId: this.id.value,
          name: this.name.value,
          description: this.description,
          occurredAt: this.createdAt.toISOString(),
        }),
      );
    }
  }

  /**
   * Updates the farm with the given data (immutable) and emits FarmUpdatedDomainEvent
   * @param data - The data to update the farm with
   * @returns A new FarmEntity instance with the updated data
   */
  update(
    data: Partial<{
      name: string;
      description: string;
      country: string;
      state: string;
      city: string;
      postalCode: string;
      street: string;
      latitude: number;
      longitude: number;
      isActive: boolean;
    }>,
  ): FarmEntity {
    const updatedFarm = new FarmEntity({
      id: this.id,
      name: data.name ? new FarmNameValueObject(data.name) : this.name,
      description: data.description ?? this.description,
      address: new FarmAddressValueObject({
        country: data.country ?? this.address.country,
        state: data.state ?? this.address.state,
        city: data.city ?? this.address.city,
        postalCode: data.postalCode ?? this.address.postalCode,
        street: data.street ?? this.address.street,
      }),
      coordinates: new FarmCoordinatesValueObject({
        latitude: data.latitude ?? this.coordinates.latitude,
        longitude: data.longitude ?? this.coordinates.longitude,
      }),
      isActive: data.isActive ?? this.isActive,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      deletedAt: this.deletedAt,
    });
    updatedFarm.addDomainEvent(
      new FarmUpdatedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: updatedFarm.id.value,
        name: updatedFarm.name.value,
        description: updatedFarm.description,
        occurredAt: updatedFarm.updatedAt.toISOString(),
      }),
    );
    return updatedFarm;
  }

  /**
   * Marks the farm as deleted (soft delete) and emits FarmDeletedDomainEvent
   * @returns A new FarmEntity instance marked as deleted
   */
  delete(): FarmEntity {
    const deletedFarm = new FarmEntity({
      id: this.id,
      name: this.name,
      description: this.description,
      address: this.address,
      coordinates: this.coordinates,
      isActive: false,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      deletedAt: new Date(),
    });
    deletedFarm.addDomainEvent(
      new FarmDeletedDomainEvent({
        eventId: crypto.randomUUID(),
        aggregateId: deletedFarm.id.value,
        name: deletedFarm.name.value,
        description: deletedFarm.description,
        occurredAt: deletedFarm.updatedAt.toISOString(),
      }),
    );
    return deletedFarm;
  }

  /**
   * Adds a domain event to the internal collection
   * @param event - The domain event to add
   */
  protected addDomainEvent(event: DomainEvent): void {
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
   * Converts the FarmEntity to its primitive representation
   */
  public toPrimitives(): FarmsPrimitive {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description,
      country: this.address.country,
      state: this.address.state,
      city: this.address.city,
      postalCode: this.address.postalCode,
      street: this.address.street,
      latitude: this.coordinates.latitude,
      longitude: this.coordinates.longitude,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt?.toISOString(),
    };
  }

  /**
   * Reconstructs a FarmEntity from its primitive representation
   */
  public static fromPrimitives(primitive: FarmsPrimitive): FarmEntity {
    return new FarmEntity({
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
      emitEvent: false,
    });
  }
}
