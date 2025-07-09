/**
 * Command to delete (soft delete) a user
 */
export class DeleteUserCommand {
  constructor(public readonly id: string) {}
}
