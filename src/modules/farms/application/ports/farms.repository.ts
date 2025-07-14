/**
 * Repository port for Farms aggregate.
 * Add more methods as needed for your use case.
 */
export interface FarmsRepository {
  /** Save an aggregate */
  save(entity: any): Promise<void>;
  /** Find an aggregate by ID */
  findById(id: string): Promise<any | null>;
  /** Update an aggregate */
  update(entity: any): Promise<void>;
  /** Delete an aggregate by ID */
  delete(id: string): Promise<void>;
  // Add more methods here if needed
}

/**
 * Injection token for FarmsRepository
 */
export const FARMS_REPOSITORY_TOKEN = 'FarmsRepository'; 