import { User } from '../../domain/entities/user.entity';

/**
 * Token for UserRepository dependency injection
 */
export const USER_REPOSITORY_TOKEN = Symbol('UserRepository');

/**
 * UserRepository port for user persistence
 */
export interface UserRepository {
  /**
   * Finds a user by id
   * @param id - User id
   * @returns User or null if not found
   */
  findById(id: string): Promise<User | null>;
  /**
   * Restores a soft-deleted user by id
   * @param id - User id
   */
  save(user: User): Promise<string>;
  /**
   * Updates an existing user
   * @param user - User to update
   */
  update(user: User): Promise<void>;
  /**
   * Soft deletes a user by id
   * @param id - User id
   */
  softDelete(id: string): Promise<void>;
}
