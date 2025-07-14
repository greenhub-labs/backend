/**
 * Value Object representing the name of a Farm.
 *
 * @property name - The name of the farm
 */

export class FarmNameValueObject {
  public readonly value: string;
  /**
   * Creates a new FarmNameValueObject
   * @param props - The name properties
   */
  constructor(value: string) {
    this.value = value;
    this.validate();
  }

  /**
   * Validates the name value object
   */
  protected validate(): void {
    const value = this.value;
    if (!value || value.trim().length === 0) {
      throw new Error('Farm name must not be empty.');
    }
    if (value.length > 100) {
      throw new Error('Farm name must not exceed 100 characters.');
    }
  }
}
