/**
 * Value Object representing the address of a Farm.
 *
 * @property country - Country of the farm
 * @property state - State or province of the farm
 * @property city - City of the farm
 * @property postalCode - Postal code of the farm
 * @property street - Full street address of the farm
 */
export interface FarmAddressProps {
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  street?: string;
}

export class FarmAddressValueObject {
  public readonly value: FarmAddressProps;
  /**
   * Creates a new FarmAddressValueObject
   * @param props - The address properties
   */
  constructor(props: FarmAddressProps) {
    this.value = props;
    this.validate();
  }

  /**
   * Returns the country of the farm
   */
  get country(): string | undefined {
    return this.value.country;
  }

  /**
   * Returns the state or province of the farm
   */
  get state(): string | undefined {
    return this.value.state;
  }

  /**
   * Returns the city of the farm
   */
  get city(): string | undefined {
    return this.value.city;
  }

  /**
   * Returns the postal code of the farm
   */
  get postalCode(): string | undefined {
    return this.value.postalCode;
  }

  /**
   * Returns the street address of the farm
   */
  get street(): string | undefined {
    return this.value.street;
  }

  /**
   * Validates the address properties
   */
  protected validate(): void {}
}
