import { CropVarietyType } from '../../constants/crop-variety-types.constants';
import { InvalidCropVarietyTypeException } from '../../exceptions/invalid-crop-variety-type/invalid-crop-variety-type.exception';

/**
 * Value Object representing the name of a Crop.
 *
 * @property name - The name of the crop
 */

export class CropVarietyTypeValueObject {
  private readonly _value: string;
  /**
   * Creates a new CropNameValueObject
   * @param props - The name properties
   */
  constructor(value: string) {
    this._value = value;
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  /**
   * Validates the status value object
   */
  protected validate(): void {
    const value = this._value;
    if (!value || value.trim().length === 0) {
      throw new InvalidCropVarietyTypeException(
        'Crop variety type must not be empty.',
      );
    }
    if (!Object.values(CropVarietyType).includes(value as CropVarietyType)) {
      throw new InvalidCropVarietyTypeException('Invalid crop variety type.');
    }
  }
}
