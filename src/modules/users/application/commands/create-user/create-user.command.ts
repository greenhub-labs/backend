/**
 * Command to create a new user
 */
export class CreateUserCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName?: string,
    public readonly avatar?: string,
    public readonly bio?: string,
  ) {}
}
