import { BaseValueObject } from 'src/shared/domain/value-objects/base.value-object';

/**
 * Value Object representing the name of a Farm.
 *
 * @property name - The name of the farm
 */
export interface FarmNameProps {
  value: string;
}

export class FarmNameValueObject extends BaseValueObject<FarmNameProps> {
  /**
   * Creates a new FarmNameValueObject
   * @param props - The name properties
   */
  constructor(props: FarmNameProps) {
    super(props);
    this.validate();
  }

  /**
   * Returns the name of the farm
   */
  get name(): string {
    return (this as any).props.value;
  }

  /**
   * Validates the name value object
   */
  protected validate(): void {
    const value = (this as any).props.value;
    if (!value || value.trim().length === 0) {
      throw new Error('Farm name must not be empty.');
    }
    if (value.length > 100) {
      throw new Error('Farm name must not exceed 100 characters.');
    }
  }
}
