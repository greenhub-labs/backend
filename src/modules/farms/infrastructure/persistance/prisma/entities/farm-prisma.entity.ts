import { FarmEntity } from '../../../../domain/entities/farm.entity';
import { FarmIdValueObject } from '../../../../domain/value-objects/farm-id/farm-id.value-object';
import { FarmNameValueObject } from '../../../../domain/value-objects/farm-name/farm-name.value-object';
import { FarmAddressValueObject } from '../../../../domain/value-objects/farm-address/farm-address.value-object';
import { FarmCoordinatesValueObject } from '../../../../domain/value-objects/farm-coordinates/farm-coordinates.value-object';

/**
 * FarmPrismaEntity
 * Maps between Prisma model and domain FarmEntity
 */
export class FarmPrismaEntity {
  /**
   * Converts a Prisma model to a domain FarmEntity
   * @param prismaData - The Prisma model data
   * @returns Domain FarmEntity
   */
  static fromPrisma(prismaData: any): FarmEntity {
    return new FarmEntity({
      id: new FarmIdValueObject(prismaData.id),
      name: new FarmNameValueObject({ value: prismaData.name }),
      description: prismaData.description ?? undefined,
      address: new FarmAddressValueObject({
        country: prismaData.country ?? '',
        state: prismaData.state ?? '',
        city: prismaData.city ?? '',
        postalCode: prismaData.postalCode ?? '',
        street: prismaData.street ?? '',
      }),
      coordinates: new FarmCoordinatesValueObject({
        latitude: prismaData.latitude ?? 0,
        longitude: prismaData.longitude ?? 0,
      }),
      isActive: prismaData.isActive,
      createdAt: prismaData.createdAt,
      updatedAt: prismaData.updatedAt,
      deletedAt: prismaData.deletedAt ?? undefined,
      emitEvent: false,
    });
  }

  /**
   * Converts a domain FarmEntity to a Prisma-compatible object
   * @param entity - The domain FarmEntity
   * @returns Prisma-compatible object
   */
  static toPrisma(entity: FarmEntity): any {
    return {
      id: entity.id.value,
      name: entity.name.name,
      description: entity.description,
      country: entity.address.country,
      state: entity.address.state,
      city: entity.address.city,
      postalCode: entity.address.postalCode,
      street: entity.address.street,
      latitude: entity.coordinates.latitude,
      longitude: entity.coordinates.longitude,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }
}
