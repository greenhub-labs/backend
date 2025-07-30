import { WATER_REQUIREMENTS } from '../../constants/water-requirements.constants';
import { InvalidCropVarietyWaterRequirementsException } from '../../exceptions/invalid-crop-variety-water-requirements/invalid-crop-variety-water-requirements.exception';

/**
 * Value Object representing the water requirements of a Crop Variety.
 *
 * @property value - The water requirements level (can be undefined for optional requirements)
 */
export class CropVarietyWaterRequirementsValueObject {
  private readonly _value?: string;

  /**
   * Creates a new CropVarietyWaterRequirementsValueObject
   * @param value - The water requirements value (optional)
   */
  constructor(value?: string) {
    this._value = value;
    this.validate();
  }

  get value(): string | undefined {
    return this._value;
  }

  /**
   * Validates the water requirements value object
   */
  protected validate(): void {
    const value = this._value;
    if (!value) {
      return;
    }

    if (
      !Object.values(WATER_REQUIREMENTS).includes(value as WATER_REQUIREMENTS)
    ) {
      throw new InvalidCropVarietyWaterRequirementsException(
        'Invalid crop variety water requirements.',
      );
    }
  }
}
