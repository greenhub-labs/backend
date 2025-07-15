import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmResponseDto } from '../dtos/responses/farm.response.dto';
import { FARM_MEMBERSHIP_ROLES } from 'src/shared/domain/constants/farm-membership-roles.constant';
import { FarmDetailsResult } from 'src/modules/farms/application/dtos/farm-details.result';

export class FarmMapper {
  static fromDomain(input: FarmDetailsResult): FarmResponseDto {
    const { farm, members } = input;
    const dto: FarmResponseDto = {
      id: farm.id.value,
      name: farm.name.value,
      description: farm.description,
      country: farm.address.country,
      state: farm.address.state,
      city: farm.address.city,
      postalCode: farm.address.postalCode,
      street: farm.address.street,
      latitude: farm.coordinates.latitude,
      longitude: farm.coordinates.longitude,
      isActive: farm.isActive,
      createdAt: farm.createdAt,
      updatedAt: farm.updatedAt,
      deletedAt: farm.deletedAt,
      members:
        members?.map(({ user, role }) => ({
          id: user.id?.value,
          firstName: user.firstName?.value,
          lastName: user.lastName?.value,
          avatar: user.avatar?.value,
          bio: user.bio,
          phone: undefined, // No existe en User
          email: undefined, // No existe en User
          isActive: user.isActive,
          isDeleted: user.isDeleted,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
          role,
        })) || undefined,
    };
    return dto;
  }
}
