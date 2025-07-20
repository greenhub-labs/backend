import { FarmDetailsResult } from 'src/modules/farms/application/dtos/farm-details.result';
import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
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
        plots?.map((plot) => ({
          id: plot.id.value,
          name: plot.name.value,
          description: plot.description,
          status: plot.status.value,
          createdAt: plot.createdAt,
          updatedAt: plot.updatedAt,
          deletedAt: plot.deletedAt,
          farmId: farm.id.value,
          soilType: plot.soilType?.value as PLOT_SOIL_TYPES,
          soilPh: plot.soilPh,
          dimensions: {
            width: plot.dimensions.width,
            length: plot.dimensions.length,
            height: plot.dimensions.height,
            area: plot.dimensions.area,
            perimeter: plot.dimensions.perimeter,
            volume: plot.dimensions.volume,
            unitMeasurement: plot.dimensions.unitMeasurement,
            unitMeasurementCategory:
              plot.dimensions.getUnitMeasurementCategory(),
          },
        })) || undefined,
    };
    return dto;
  }
}
