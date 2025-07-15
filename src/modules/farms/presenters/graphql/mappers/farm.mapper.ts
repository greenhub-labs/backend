import { FarmEntity } from '../../../domain/entities/farm.entity';
import { FarmResponseDto } from '../dtos/responses/farm.response.dto';
import { UserResponseDto } from 'src/modules/users/presenters/graphql/dtos/responses/user.response.dto';
import { User } from 'src/modules/users/domain/entities/user.entity';

export class FarmMapper {
  static fromDomain(input: {
    farm: FarmEntity;
    members?: any[];
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
        members?.map((user) => ({
          id: user.id.value,
          firstName: user.firstName.value,
          lastName: user.lastName.value,
          avatar: user.avatar,
          bio: user.bio,
          phone: user.phone,
          email: user.email,
          isActive: user.isActive,
          isDeleted: user.isDeleted,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
        })) || undefined,
    };
    return dto;
  }
}
