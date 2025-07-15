import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmResponseDto } from '../dtos/responses/farm.response.dto';
import { FARM_MEMBERSHIP_ROLES } from 'src/modules/farms/domain/constants/farm-membership-roles.constant';

export class FarmMapper {
  static fromDomain(input: {
    farm: FarmEntity;
    members?: { user: any; role: FARM_MEMBERSHIP_ROLES }[];
  }): FarmResponseDto {
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
          phone: user.phone,
          email: user.email,
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
