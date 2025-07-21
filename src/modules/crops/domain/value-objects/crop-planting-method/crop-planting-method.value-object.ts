import { CROP_PLANTING_METHODS } from '../../constants/crop-planting-methods.constant';
import { InvalidCropPlantingMethodException } from '../../exceptions/invalid-crop-planting-method/invalid-crop-planting-method.exception';

/**
 * Value Object representing the planting method of a Crop.
 *
 * @property plantingMethod - The planting method of the crop
 */

export class CropPlantingMethodValueObject {
  private readonly _value: string;
  /**
   * Creates a new CropPlantingMethodValueObject
   * @param props - The planting method properties
   */
  constructor(value: string) {
    this._value = value;
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  /**
   * Validates the planting method value object
   */
  protected validate(): void {
    const value = this._value;
    if (!value || value.trim().length === 0) {
      throw new InvalidCropPlantingMethodException(
        'Crop planting method must not be empty.',
      );
    }
    if (
      !Object.values(CROP_PLANTING_METHODS).includes(
        value as CROP_PLANTING_METHODS,
      )
    ) {
      throw new InvalidCropPlantingMethodException(
        'Invalid crop planting method.',
      );
    }
  }
}
