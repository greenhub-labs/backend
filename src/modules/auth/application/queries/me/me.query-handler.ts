import { IQueryHandler, QueryHandler, QueryBus } from '@nestjs/cqrs';
import { MeQuery } from './me.query';
import { GetUserByIdQuery } from '../../../../users/application/queries/get-user-by-id/get-user-by-id.query';
import { User } from '../../../../users/domain/entities/user.entity';

/**
 * Query handler for getting current authenticated user information
 * Delegates to the Users module to retrieve user data
 *
 * @author GreenHub Labs
 */
@QueryHandler(MeQuery)
export class MeQueryHandler implements IQueryHandler<MeQuery> {
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * Execute the query to get authenticated user information
   * @param query - The query containing the user ID
   * @returns The User domain entity
   */
  async execute(query: MeQuery): Promise<User> {
    // Delegate to Users module to get user information
    const getUserQuery = new GetUserByIdQuery(query.userId);
    const user: User = await this.queryBus.execute(getUserQuery);

    return user;
  }
}
