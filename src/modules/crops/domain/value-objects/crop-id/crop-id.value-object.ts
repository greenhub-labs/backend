import { UuidValueObject } from 'src/shared/domain/value-objects/uuid.value-object';

/**
 * CropIdValueObject
 * Value Object for Crop ID
 */
export class CropIdValueObject extends UuidValueObject {
  /**
   * Creates a new CropIdValueObject
   * @param value UUID string
   */
  constructor(value: string) {
    super(value);
  }
}
