import { SEASON } from 'src/shared/domain/constants/season.constant';
import { InvalidCropVarietySeasonException } from '../../exceptions/invalid-crop-variety-season/invalid-crop-variety-season.exception';

/**
 * Value Object representing the name of a Crop.
 *
 * @property name - The name of the crop
 */

export class CropVarietySeasonValueObject {
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
      throw new InvalidCropVarietySeasonException(
        'Crop variety season must not be empty.',
      );
    }
    if (!Object.values(SEASON).includes(value as SEASON)) {
      throw new InvalidCropVarietySeasonException(
        'Invalid crop variety season.',
      );
    }
  }
}
