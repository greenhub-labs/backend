/**
 * Command to update an existing Farm
 */
export class UpdateFarmCommand {
  /** Unique identifier for the farm */
  readonly id: string;
  /** Name of the farm */
  readonly name?: string;
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

  /**
   * Creates a new UpdateFarmCommand
   * @param params - Command properties
   */
  constructor(params: {
    id: string;
    name?: string;
    description?: string;
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    street?: string;
    latitude?: number;
    longitude?: number;
    isActive?: boolean;
  }) {
    this.id = params.id;
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
  }
}
