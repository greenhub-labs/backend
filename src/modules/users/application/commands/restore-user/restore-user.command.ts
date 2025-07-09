/**
 * Command to restore a previously deleted user (soft restore).
 *
 * @remarks
 * This command triggers the restoration of a user by its unique identifier.
 */
export class RestoreUserCommand {
  /**
   * @param userId The unique identifier of the user to restore
   */
  constructor(public readonly userId: string) {}
}
