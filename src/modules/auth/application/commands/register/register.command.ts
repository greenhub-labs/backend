/**
 * RegisterCommand
 * Command for user registration with email and password
 *
 * @author GreenHub Labs
 */
export class RegisterCommand {
  /**
   * Creates a new RegisterCommand
   * @param email - User email address
   * @param password - Plain text password
   * @param firstName - User first name (optional)
   * @param lastName - User last name (optional)
   * @param phone - User phone number (optional)
   */
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly phone?: string,
  ) {}
}
