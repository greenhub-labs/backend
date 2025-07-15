/**
 * Command to create a new Farm
 */
import { FARM_MEMBERSHIP_ROLES } from 'src/modules/farms/domain/constants/farm-membership-roles.constant';

export class CreateFarmCommand {
  /** Name of the farm */
  readonly name: string;
  /** Optional description */
  readonly description?: string;
  /** Country */
  readonly country?: string;
  /** State or province */
  readonly state?: string;
  /** City */
  readonly city?: string;
  /** Postal code */
  readonly postalCode?: string;
  /** Street address */
  readonly street?: string;
  /** Latitude */
  readonly latitude?: number;
  /** Longitude */
  readonly longitude?: number;
  /** Whether the farm is active */
  readonly isActive?: boolean;
  /** User identifier (creator, will be assigned as OWNER) */
  readonly userId: string;

  /**
   * Creates a new CreateFarmCommand
   * @param params - Command properties
   */
  constructor(params: {
    name: string;
    description?: string;
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    street?: string;
    latitude?: number;
    longitude?: number;
    isActive: boolean;
    userId: string;
  }) {
    this.name = params.name;
    this.description = params.description;
    this.country = params.country;
    this.state = params.state;
    this.city = params.city;
    this.postalCode = params.postalCode;
    this.street = params.street;
    this.latitude = params.latitude;
    this.longitude = params.longitude;
    this.isActive = params.isActive;
    this.userId = params.userId;
  }
}
