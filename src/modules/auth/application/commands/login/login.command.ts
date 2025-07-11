/**
 * LoginCommand
 * Command for user authentication with email and password
 *
 * @author GreenHub Labs
 */
export class LoginCommand {
  /**
   * Creates a new LoginCommand
   * @param email - User email address
   * @param password - Plain text password
   * @param ipAddress - Client IP address (optional)
   * @param userAgent - Client user agent (optional)
   */
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly ipAddress?: string,
    public readonly userAgent?: string,
  ) {}
}
