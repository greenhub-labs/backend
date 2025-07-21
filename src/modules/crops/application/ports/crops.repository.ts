import { CropEntity } from '../../domain/entities/crop.entity';

/**
 * Port for the Crops repository (Dependency Inversion)
 * Defines the contract for persistence operations on Crop entities.
 */
export interface CropsRepository {
  /**
   * Saves a new Crop entity
   * @param crop - The Crop entity to save
   */
  save(crop: CropEntity): Promise<void>;

  /**
   * Finds a Crop entity by its ID
   * @param id - The Crop ID (as string)
   * @returns The Crop entity or null if not found
   */
  findById(id: string): Promise<CropEntity | null>;

  /**
   * Returns all Crop entities
   * @returns The Crop entities or empty array if not found
   */
  findAll(): Promise<CropEntity[]>;

  /**
   * Returns all Crop entities by farm ID
   * @param farmId - The Farm ID (as string)
   * @returns The Crop entities or empty array if not found
   */
  findAllByFarmId(farmId: string): Promise<CropEntity[]>;

  /**
   * Returns all Crop entities by plot ID
   * @param plotId - The Plot ID (as string)
   * @returns The Crop entities or empty array if not found
   */
  findAllByPlotId(plotId: string): Promise<CropEntity[]>;

  /**
   * Updates an existing Crop entity
   * @param crop - The Crop entity to update
   */
  update(crop: CropEntity): Promise<void>;

  /**
   * Deletes a Crop entity by its ID
   * @param id - The Crop ID (as string)
   */
  delete(id: string): Promise<void>;
}

/**
 * Injection token for CropsRepository
 */
export const CROPS_REPOSITORY_TOKEN = 'CropsRepository';
