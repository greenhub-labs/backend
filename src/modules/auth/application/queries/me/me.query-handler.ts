import { IQueryHandler, QueryHandler, QueryBus } from '@nestjs/cqrs';
import { MeQuery } from './me.query';
import { GetUserByIdQuery } from '../../../../users/application/queries/get-user-by-id/get-user-by-id.query';
import { User } from '../../../../users/domain/entities/user.entity';
import { Inject, Logger } from '@nestjs/common';
import {
  AUTH_REPOSITORY_TOKEN,
  AuthRepository,
} from '../../ports/auth.repository';
import { UserDetailsResult } from '../../../../users/application/dtos/user-details.result';

/**
 * Query handler for getting current authenticated user information
 * Delegates to the Users module to retrieve user data
 *
 * @author GreenHub Labs
 */
@QueryHandler(MeQuery)
export class MeQueryHandler implements IQueryHandler<MeQuery> {
  private readonly logger = new Logger(MeQueryHandler.name);
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: AuthRepository,
  ) {}

  /**
   * Execute the query to get authenticated user information
   * @param query - The query containing the user ID
   * @returns An object with user, email, and phone
   */
  async execute(query: MeQuery): Promise<UserDetailsResult> {
    // Delegate to Users module to get user information
    const getUserQuery = new GetUserByIdQuery(query.userId);
    const userDetails: UserDetailsResult =
      await this.queryBus.execute(getUserQuery);

    // Get auth info for email and phone
    const auth = await this.authRepository.findByUserId(query.userId);
    if (!auth) {
      throw new Error('Auth not found for user');
    }

    // Set email and phone to the user from auth
    userDetails.user.email = auth.email.value;
    userDetails.user.phone = auth.phone;

    return userDetails;
  }
}
