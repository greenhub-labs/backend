import { User } from '../../domain/entities/user.entity';

/**
 * UserRepository port for user persistence
 */
export interface UserRepository {
  save(user: User): Promise<void>;
}
