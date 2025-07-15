import { User } from 'src/modules/users/domain/entities/user.entity';

/**
 * Port for the FarmMemberships repository (Dependency Inversion)
 * Defines the contract for retrieving farm members.
 */
export interface FarmMembershipsRepository {
  /**
   * Gets all users assigned to a farm by farmId
   * @param farmId - The farm ID
   */
  getUsersByFarmId(farmId: string): Promise<User[]>;
}
