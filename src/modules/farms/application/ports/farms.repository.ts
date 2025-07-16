import { FarmEntity } from '../../domain/entities/farm.entity';
import { FARM_MEMBERSHIP_ROLES } from '../../../../shared/domain/constants/farm-membership-roles.constant';

/**
 * Port for the Farms repository (Dependency Inversion)
 * Defines the contract for persistence operations on Farm entities.
 */
export interface FarmsRepository {
  /**
   * Saves a new Farm entity
   * @param farm - The Farm entity to save
   */
  save(farm: FarmEntity): Promise<void>;

  /**
   * Finds a Farm entity by its ID
   * @param id - The Farm ID (as string)
   * @returns The Farm entity or null if not found
   */
  findById(id: string): Promise<FarmEntity | null>;

  /**
   * Returns all Farm entities
   */
  findAll(): Promise<FarmEntity[]>;

  /**
   * Updates an existing Farm entity
   * @param farm - The Farm entity to update
   */
  update(farm: FarmEntity): Promise<void>;

  /**
   * Deletes a Farm entity by its ID
   * @param id - The Farm ID (as string)
   */
  delete(id: string): Promise<void>;
}

/**
 * Injection token for FarmsRepository
 */
export const FARMS_REPOSITORY_TOKEN = 'FarmsRepository';
