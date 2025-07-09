/**
 * Data Transfer Object for User
 */
export class UserDto {
  constructor(
    public readonly id: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly avatar?: string,
    public readonly bio?: string,
    public readonly isActive?: boolean,
    public readonly isDeleted?: boolean,
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
  ) {}
}
