/**
 * Command to update a user
 */
export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly avatar?: string,
    public readonly bio?: string,
  ) {}
}
