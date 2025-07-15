import { User } from '../../domain/entities/user.entity';

export class UserFarmMembership {
  constructor(
    public readonly farmId: string,
    public readonly farmName: string,
    public readonly role: string,
  ) {}
}

export class UserDetails {
  /** User ID */
  readonly id: string;
  /** First name */
  readonly firstName?: string;
  /** Last name */
  readonly lastName?: string;
  /** Avatar URL */
  readonly avatar?: string;
  /** User bio */
  readonly bio?: string;
  /** Whether the user is active */
  readonly isActive: boolean;
  /** Soft delete flag */
  readonly isDeleted: boolean;
  /** Creation date */
  readonly createdAt: string;
  /** Last update date */
  readonly updatedAt: string;
  /** Deletion date */
  readonly deletedAt?: string | null;
  /** User email */
  email?: string;
  /** User phone */
  phone?: string;

  constructor(user: User, email?: string, phone?: string) {
    this.id = user.id.value;
    this.firstName = user.firstName?.value;
    this.lastName = user.lastName?.value;
    this.avatar = user.avatar?.value;
    this.bio = user.bio;
    this.isActive = user.isActive;
    this.isDeleted = user.isDeleted;
    this.createdAt = user.createdAt.toISOString();
    this.updatedAt = user.updatedAt.toISOString();
    this.deletedAt = user.deletedAt?.toISOString() ?? null;
    this.email = email;
    this.phone = phone;
  }
}

/**
 * User details DTO for API responses
 * Flattens user fields and adds farms, email, and phone
 */
export class UserDetailsResult {
  readonly user: UserDetails;
  readonly farms: UserFarmMembership[];

  /**
   * Creates a new UserDetailsResult
   * @param user User entity
   * @param farms Farms memberships
   * @param email User email
   * @param phone User phone
   */
  constructor(user: UserDetails, farms: UserFarmMembership[]) {
    this.user = user;
    this.farms = farms;
  }
}
