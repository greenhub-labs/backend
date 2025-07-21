import { CROP_STATUS } from '../../constants/crop-status.constant';
import { InvalidCropStatusException } from '../../exceptions/invalid-crop-status/invalid-crop-status.exception';

/**
 * Value Object representing the name of a Crop.
 *
 * @property name - The name of the crop
 */

export class CropStatusValueObject {
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
      throw new InvalidCropStatusException('Crop status must not be empty.');
    }
    if (!Object.values(CROP_STATUS).includes(value as CROP_STATUS)) {
      throw new InvalidCropStatusException('Invalid crop status.');
    }
  }
}
