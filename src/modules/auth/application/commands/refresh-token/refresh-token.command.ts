/**
 * RefreshTokenCommand
 * Command for refreshing access tokens using a valid refresh token
 *
 * @author GreenHub Labs
 */
export class RefreshTokenCommand {
  /**
   * Creates a new RefreshTokenCommand
   * @param refreshToken - Valid refresh token string
   */
  constructor(public readonly refreshToken: string) {}
}
