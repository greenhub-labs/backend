import { UuidValueObject } from 'src/shared/domain/value-objects/uuid.value-object';

/**
 * FarmIdValueObject
 * Value Object for Farm ID
 */
export class FarmIdValueObject extends UuidValueObject {
  /**
   * Creates a new FarmIdValueObject
   * @param value UUID string
   */
  constructor(value: string) {
    super(value);
  }
}
