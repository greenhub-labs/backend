/**
 * MeQuery
 * Query for getting current authenticated user information
 *
 * @author GreenHub Labs
 */
export class MeQuery {
  /**
   * Creates a new MeQuery
   * @param userId - ID of the authenticated user
   */
  constructor(public readonly userId: string) {}
}
