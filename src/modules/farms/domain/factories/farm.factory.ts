import { Injectable } from '@nestjs/common';
import { FarmEntity } from '../entities/farm.entity';
import { FarmIdValueObject } from '../value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from '../value-objects/farm-name/farm-name.value-object';
import { FarmAddressValueObject } from '../value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from '../value-objects/farm-coordinates/farm-coordinates.value-object';
import { randomUUID } from 'crypto';

/**
 * Factory class for creating Farm domain objects from primitive data
 */
@Injectable()
export class FarmsFactory {
  /**
   * Creates a new FarmEntity from primitive data (e.g., from a DTO)
   * @param data - Primitive data for the farm
   */
  create(data: {
    name: string;
    description?: string;
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    street?: string;
    latitude?: number;
    longitude?: number;
    isActive?: boolean;
  }): FarmEntity {
    return new FarmEntity({
      id: new FarmIdValueObject(randomUUID()),
      name: new FarmNameValueObject({ value: data.name }),
      description: data.description,
      address: new FarmAddressValueObject({
        country: data.country,
        state: data.state,
        city: data.city,
        postalCode: data.postalCode,
        street: data.street,
      }),
      coordinates: new FarmCoordinatesValueObject({
        latitude: data.latitude,
        longitude: data.longitude,
      }),
      isActive: data.isActive ?? true,
    });
  }

  /**
   * Reconstructs a FarmEntity from its primitive representation (e.g., from persistence)
   * @param primitives - Primitive data from persistence
   */
  static fromPrimitives(primitives: {
    id: string;
    name: string;
    description?: string;
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    street?: string;
    latitude?: number;
    longitude?: number;
    isActive: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    deletedAt?: string | Date;
  }): FarmEntity {
    return new FarmEntity({
      id: new FarmIdValueObject(primitives.id),
      name: new FarmNameValueObject({ value: primitives.name }),
      description: primitives.description,
      address: new FarmAddressValueObject({
        country: primitives.country,
        state: primitives.state,
        city: primitives.city,
        postalCode: primitives.postalCode,
        street: primitives.street,
      }),
      coordinates: new FarmCoordinatesValueObject({
        latitude: primitives.latitude,
        longitude: primitives.longitude,
      }),
      isActive: primitives.isActive,
      createdAt: new Date(primitives.createdAt),
      updatedAt: new Date(primitives.updatedAt),
      deletedAt: primitives.deletedAt
        ? new Date(primitives.deletedAt)
        : undefined,
      emitEvent: false,
    });
  }
}
