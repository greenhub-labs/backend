/**
 * UuidValueObject
 * Generic Value Object for UUID identifiers
 */
export class UuidValueObject {
  public readonly value: string;

  /**
   * Creates a new UuidValueObject
   * @param value UUID string
   */
  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  /**
   * Validates the UUID format
   * @param value UUID string
   * @throws Error if not a valid UUID
   */
  protected validate(value: string): void {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error(`Invalid UUID: ${value}`);
    }
  }

  /**
   * Checks equality with another value object
   */
  equals(vo: UuidValueObject): boolean {
    return vo instanceof UuidValueObject && vo.value === this.value;
  }
}
