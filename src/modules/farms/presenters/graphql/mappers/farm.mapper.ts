import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmResponseDto } from '../dtos/responses/farm.response.dto';

export class FarmMapper {
  static fromDomain(entity: FarmEntity): FarmResponseDto {
    return {
      id: entity.id.value,
      name: entity.name.value,
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
      deletedAt: entity.deletedAt,
    };
  }
}
