import { Auth } from '../../domain/entities/auth.entity';

/**
 * Token for AuthRepository dependency injection
 */
export const AUTH_REPOSITORY_TOKEN = Symbol('AuthRepository');

/**
 * AuthRepository port for auth persistence
 * Defines the contract for auth data operations
 *
 * @author GreenHub Labs
 */
export interface AuthRepository {
  /**
   * Finds auth record by user ID
   * @param userId - User ID
   * @returns Auth or null if not found
   */
  findByUserId(userId: string): Promise<Auth | null>;

  /**
   * Finds auth record by email
   * @param email - Email address
   * @returns Auth or null if not found
   */
  findByEmail(email: string): Promise<Auth | null>;

  /**
   * Saves an auth record (create or update)
   * @param auth - Auth entity to save
   * @returns Auth ID
   */
  save(auth: Auth): Promise<string>;

  /**
   * Updates an existing auth record
   * @param auth - Auth entity to update
   */
  update(auth: Auth): Promise<void>;

  /**
   * Soft deletes an auth record by user ID
   * @param userId - User ID
   */
  softDelete(userId: string): Promise<void>;

  /**
   * Checks if email already exists
   * @param email - Email to check
   * @returns True if email exists
   */
  emailExists(email: string): Promise<boolean>;
}
