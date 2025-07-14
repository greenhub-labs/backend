import { FARM_MEMBERSHIP_ROLES } from 'src/modules/farms/domain/constants/farm-membership-roles.constant';

/**
 * Command to assign a user to a farm.
 */
export class AssignUserToFarmCommand {
  /** Farm identifier */
  readonly farmId: string;
  /** User identifier */
  readonly userId: string;
  /** Role */
  readonly role: FARM_MEMBERSHIP_ROLES;
  /**
   * Creates a new AssignUserToFarmCommand
   * @param farmId - Farm identifier
   * @param userId - User identifier
   * @param role - Role
   */
  constructor(farmId: string, userId: string, role: FARM_MEMBERSHIP_ROLES) {
    this.farmId = farmId;
    this.userId = userId;
    this.role = role;
  }
}
