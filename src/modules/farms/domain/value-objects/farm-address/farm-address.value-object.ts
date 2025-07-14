import { BaseValueObject } from 'src/shared/domain/value-objects/base.value-object';

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

export class FarmAddressValueObject extends BaseValueObject<FarmAddressProps> {
  /**
   * Creates a new FarmAddressValueObject
   * @param props - The address properties
   */
  constructor(props: FarmAddressProps) {
    super(props);
    this.validate();
  }

  private getProps(): FarmAddressProps {
    return (this as any).props ?? {};
  }

  /**
   * Returns the country of the farm
   */
  get country(): string | undefined {
    return this.getProps().country;
  }

  /**
   * Returns the state or province of the farm
   */
  get state(): string | undefined {
    return this.getProps().state;
  }

  /**
   * Returns the city of the farm
   */
  get city(): string | undefined {
    return this.getProps().city;
  }

  /**
   * Returns the postal code of the farm
   */
  get postalCode(): string | undefined {
    return this.getProps().postalCode;
  }

  /**
   * Returns the street address of the farm
   */
  get street(): string | undefined {
    return this.getProps().street;
  }

  /**
   * Validates the address properties
   */
  protected validate(): void {
    const props = this.getProps();
    if (
      !props.country &&
      !props.state &&
      !props.city &&
      !props.postalCode &&
      !props.street
    ) {
      throw new Error('At least one address field must be provided.');
    }
  }
}
