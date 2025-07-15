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

  /**
   * Assigns a user to a farm with a specific role
   * @param farmId - The farm ID
   * @param userId - The user ID
   * @param role - The role to assign
   */
  assignUserToFarm(
    farmId: string,
    userId: string,
    role: FARM_MEMBERSHIP_ROLES,
  ): Promise<void>;
}
