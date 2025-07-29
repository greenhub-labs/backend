import { CropVarietyEntity } from '../../domain/entities/crop-variety.entity';

/**
 * Port for the CropVariety repository (Dependency Inversion)
 * Defines the contract for persistence operations on CropVariety entities.
 */
export interface CropVarietyRepository {
  /**
   * Saves a new CropVariety entity
   * @param cropVariety - The CropVariety entity to save
   */
  save(cropVariety: CropVarietyEntity): Promise<void>;

  /**
   * Finds a CropVariety entity by its ID
   * @param id - The CropVariety ID (as string)
   * @returns The CropVariety entity or null if not found
   */
  findById(id: string): Promise<CropVarietyEntity | null>;

  /**
   * Returns all CropVariety entities
   * @returns The CropVariety entities or empty array if not found
   */
  findAll(): Promise<CropVarietyEntity[]>;

  /**
   * Updates an existing CropVariety entity
   * @param cropVariety - The CropVariety entity to update
   */
  update(cropVariety: CropVarietyEntity): Promise<void>;

  /**
   * Deletes a CropVariety entity by its ID
   * @param id - The CropVariety ID (as string)
   */
  delete(id: string): Promise<void>;

  /**
   * Finds a CropVariety entity by its scientific name
   * @param scientificName - The scientific name of the CropVariety
   * @returns The CropVariety entity or null if not found
   */
  findByScientificName(
    scientificName: string,
  ): Promise<CropVarietyEntity | null>;
}

/**
 * Injection token for CropVarietyRepository
 */
export const CROP_VARIETY_REPOSITORY_TOKEN = 'CropVarietyRepository';
