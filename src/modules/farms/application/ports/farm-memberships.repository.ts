import { User } from 'src/modules/users/domain/entities/user.entity';
import { FARM_MEMBERSHIP_ROLES } from 'src/modules/farms/domain/constants/farm-membership-roles.constant';

export interface FarmMemberWithRole {
  user: User;
  role: FARM_MEMBERSHIP_ROLES;
}

/**
 * Port for the FarmMemberships repository (Dependency Inversion)
 * Defines the contract for retrieving farm members.
 */
export interface FarmMembershipsRepository {
  /**
   * Gets all users assigned to a farm by farmId, including their role
   * @param farmId - The farm ID
   */
  getUsersByFarmId(farmId: string): Promise<FarmMemberWithRole[]>;
}
