/**
 * Abstract base class for all Value Objects in the system.
 * Following Domain-Driven Design principles, value objects are immutable
 * and are compared by their values, not their identity.
 */
export abstract class BaseValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this.validate(value);
    this._value = Object.freeze(value);
  }

  /**
   * Gets the primitive value
   */
  get value(): T {
    return this._value;
  }

  /**
   * Validates the value according to business rules
   * @param value The value to validate
   * @throws Error if validation fails
   */
  protected abstract validate(value: T): void;

  /**
   * Checks equality with another value object
   */
  equals(other: BaseValueObject<T>): boolean {
    if (!other || other.constructor !== this.constructor) {
      return false;
    }

    return this.deepEquals(this._value, other._value);
  }

  /**
   * Deep equality comparison for complex objects
   */
  private deepEquals(a: any, b: any): boolean {
    if (a === b) return true;

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
      return a === b;
    }

    if (a === null || a === undefined || b === null || b === undefined) {
      return false;
    }

    if (a.prototype !== b.prototype) return false;

    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) {
      return false;
    }

    return keys.every((k) => this.deepEquals(a[k], b[k]));
  }

  /**
   * Returns string representation of the value
   */
  toString(): string {
    return String(this._value);
  }
}
