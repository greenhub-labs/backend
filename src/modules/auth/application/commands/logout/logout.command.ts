/**
 * LogoutCommand
 *
 * Command for logging out a user from the authentication system.
 * Handles the logout process and triggers relevant domain events.
 */
export class LogoutCommand {
  /**
   * Creates a new LogoutCommand
   *
   * @param userId - User identifier who is logging out
   * @param sessionId - Session identifier to terminate (optional)
   * @param logoutMethod - Method used for logout (manual, automatic, forced)
   * @param reason - Reason for logout (optional)
   */
  constructor(
    public readonly userId: string,
    public readonly sessionId?: string,
    public readonly logoutMethod: string = 'manual',
    public readonly reason?: string,
  ) {}
}
