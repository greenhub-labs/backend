/**
 * Value Object for CropVariety ID
 */
export class CropVarietyIdValueObject {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Invalid CropVarietyId');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }
}
