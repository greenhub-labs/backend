import { v4 as uuidv4 } from 'uuid';

/**
 * FarmsIdValueObject
 * Value Object for Farms ID
 */
export class FarmsIdValueObject {
  public readonly value: string;

  constructor(value?: string) {
    this.value = value ?? uuidv4();
    // TODO: Add validation if needed
  }

  /**
   * Checks equality with another value object
   */
  equals(vo: FarmsIdValueObject): boolean {
    return vo instanceof FarmsIdValueObject && vo.value === this.value;
  }
} 