import { User } from '../../domain/entities/user.entity';

/**
 * UserRepository port for user persistence
 */
export interface UserRepository {
  /**
   * Saves a user
   * @param user - User to save
   */
  save(user: User): Promise<void>;
  /**
   * Finds a user by id
   * @param id - User id
   * @returns User or null if not found
   */
  findById(id: string): Promise<User | null>;
}
