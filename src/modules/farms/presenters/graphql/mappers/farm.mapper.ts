import { FarmDetailsResult } from 'src/modules/farms/application/dtos/farm-details.result';
import { PlotMapper } from 'src/modules/plots/presenters/graphql/mappers/plot.mapper';
import { FarmResponseDto } from '../dtos/responses/farm.response.dto';

export class FarmMapper {
  static fromDomain(input: FarmDetailsResult): FarmResponseDto {
    const { farm, members, plots } = input;
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
          phone: undefined, // Doesn't exist in User
          email: undefined, // Doesn't exist in User
          isActive: user.isActive,
          isDeleted: user.isDeleted,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
          role,
        })) || undefined,
      plots:
        plots?.map((plotDetails) => ({
          ...PlotMapper.fromDomain(plotDetails),
        })) || undefined,
    };
    return dto;
  }
}
