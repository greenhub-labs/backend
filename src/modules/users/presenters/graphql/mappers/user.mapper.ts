import { User } from '../../../domain/entities/user.entity';
import {
  UserDetailsResult,
  UserFarmMembership,
} from '../../../application/dtos/user-details.result';
import {
  UserDetailsResponseDto,
  UserFarmMembershipDto,
} from '../dtos/responses/user.response.dto';
import { FARM_MEMBERSHIP_ROLES } from 'src/shared/domain/constants/farm-membership-roles.constant';

export class UserMapper {
  static toResponseDto(details: UserDetailsResult): UserDetailsResponseDto {
    const { farms, user } = details;
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      bio: user.bio,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
      deletedAt: user.deletedAt ? new Date(user.deletedAt) : undefined,
      farms:
        farms?.map((farm) => ({
          farmId: farm.farmId,
          farmName: farm.farmName,
          role: farm.role as FARM_MEMBERSHIP_ROLES,
        })) || undefined,
      email: user.email,
      phone: user.phone,
    };
  }
}
