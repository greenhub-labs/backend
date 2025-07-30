import { SUN_REQUIREMENTS } from '../../constants/sun-requirements.constants';
import { InvalidCropVarietySunRequirementsException } from '../../exceptions/invalid-crop-variety-sun-requirements/invalid-crop-variety-sun-requirements.exception';

/**
 * Value Object representing the sun requirements of a Crop Variety.
 *
 * @property value - The sun requirements level (can be undefined for optional requirements)
 */
export class CropVarietySunRequirementsValueObject {
  private readonly _value?: string;

  /**
   * Creates a new CropVarietySunRequirementsValueObject
   * @param value - The sun requirements value (optional)
   */
  constructor(value?: string) {
    this._value = value;
    this.validate();
  }

  get value(): string | undefined {
    return this._value;
  }

  /**
   * Validates the sun requirements value object
   */
  protected validate(): void {
    const value = this._value;
    if (!value) {
      return;
    }

    if (!Object.values(SUN_REQUIREMENTS).includes(value as SUN_REQUIREMENTS)) {
      throw new InvalidCropVarietySunRequirementsException(
        'Invalid crop variety sun requirements.',
      );
    }
  }
}
