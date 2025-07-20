import { UuidValueObject } from 'src/shared/domain/value-objects/uuid.value-object';

/**
 * PlotIdValueObject
 * Value Object for Plot ID
 */
export class PlotIdValueObject extends UuidValueObject {
  /**
   * Creates a new PlotIdValueObject
   * @param value UUID string
   */
  constructor(value: string) {
    super(value);
  }
}
