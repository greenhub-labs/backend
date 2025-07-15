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
    const { user, farms } = details;
    return {
      id: user.id.value,
      firstName: user.firstName?.value,
      lastName: user.lastName?.value,
      avatar: user.avatar?.value,
      bio: user.bio,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      farms:
        farms?.map((farm) => ({
          farmId: farm.farmId,
          farmName: farm.farmName,
          role: farm.role as FARM_MEMBERSHIP_ROLES,
        })) || undefined,
    };
  }
}
