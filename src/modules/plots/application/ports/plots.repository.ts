import { PlotEntity } from '../../domain/entities/plot.entity';

/**
 * Port for the Plots repository (Dependency Inversion)
 * Defines the contract for persistence operations on Plot entities.
 */
export interface PlotsRepository {
  /**
   * Saves a new Plot entity
   * @param plot - The Plot entity to save
   */
  save(plot: PlotEntity): Promise<void>;

  /**
   * Finds a Plot entity by its ID
   * @param id - The Plot ID (as string)
   * @returns The Plot entity or null if not found
   */
  findById(id: string): Promise<PlotEntity | null>;

  /**
   * Returns all Plot entities
   */
  findAll(): Promise<PlotEntity[]>;

  /**
   * Updates an existing Farm entity
   * @param plot - The Plot entity to update
   */
  update(plot: PlotEntity): Promise<void>;

  /**
   * Deletes a Farm entity by its ID
   * @param id - The Plot ID (as string)
   */
  delete(id: string): Promise<void>;
}

/**
 * Injection token for FarmsRepository
 */
export const PLOTS_REPOSITORY_TOKEN = 'PlotsRepository';
