import { InvalidDateException } from '../exceptions/invalid-date/invalid-date.exception';
import { BaseValueObject } from './base.value-object';

/**
 * Generic Value Object for handling dates in the domain.
 * Ensures the date is valid and provides safe access to ISO string and Date.
 * Can be extended by other value objects for specific date semantics.
 */
export class DateValueObject extends BaseValueObject<Date | undefined> {
  /**
   * Validates that the value is a valid Date or undefined
   * @param value The date value to validate
   * @throws Error if the date is invalid
   */
  protected validate(value: Date | undefined): void {
    if (value === undefined) return;
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new InvalidDateException(value.toString());
    }
  }

  /**
   * Returns the value as a Date instance, or undefined
   */
  get date(): Date | undefined {
    return this._value;
  }

  /**
   * Returns the value as an ISO string, or undefined if not set/invalid
   */
  toISOString(): string | undefined {
    return this._value ? this._value.toISOString() : undefined;
  }
}
