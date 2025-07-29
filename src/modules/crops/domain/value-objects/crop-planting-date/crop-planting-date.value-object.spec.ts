import { InvalidDateException } from 'src/shared/domain/exceptions/invalid-date/invalid-date.exception';
import { CropPlantingDateValueObject } from './crop-planting-date.value-object';

describe('CropPlantingDateValueObject', () => {
  describe('constructor', () => {
    it('should create a CropPlantingDateValueObject with valid date', () => {
      const validDate = new Date('2024-01-15');
      const plantingDate = new CropPlantingDateValueObject(validDate);

      expect(plantingDate).toBeInstanceOf(CropPlantingDateValueObject);
      expect(plantingDate.value).toEqual(validDate);
      expect(plantingDate.date).toEqual(validDate);
    });

    it('should create a CropPlantingDateValueObject with undefined', () => {
      const plantingDate = new CropPlantingDateValueObject(undefined);

      expect(plantingDate).toBeInstanceOf(CropPlantingDateValueObject);
      expect(plantingDate.value).toBeUndefined();
      expect(plantingDate.date).toBeUndefined();
    });

    it('should create a CropPlantingDateValueObject with various valid dates', () => {
      const testDates = [
        new Date('2024-01-01'),
        new Date('2024-06-15'),
        new Date('2024-12-31'),
        new Date('2023-03-20'),
        new Date('2025-07-10'),
      ];

      testDates.forEach((date) => {
        const plantingDate = new CropPlantingDateValueObject(date);
        expect(plantingDate.value).toEqual(date);
        expect(plantingDate.date).toEqual(date);
      });
    });
  });

  describe('validation', () => {
    it('should throw InvalidDateException for invalid date', () => {
      const invalidDate = new Date('invalid-date');

      expect(() => {
        new CropPlantingDateValueObject(invalidDate);
      }).toThrow(InvalidDateException);
    });

    it('should throw InvalidDateException for NaN date', () => {
      const nanDate = new Date(NaN);

      expect(() => {
        new CropPlantingDateValueObject(nanDate);
      }).toThrow(InvalidDateException);
    });

    it('should throw InvalidDateException for non-Date values', () => {
      expect(() => {
        new CropPlantingDateValueObject('2024-01-15' as any);
      }).toThrow(InvalidDateException);

      expect(() => {
        new CropPlantingDateValueObject(123 as any);
      }).toThrow(InvalidDateException);

      expect(() => {
        new CropPlantingDateValueObject({} as any);
      }).toThrow(InvalidDateException);
    });

    it('should accept valid Date objects', () => {
      const validDates = [
        new Date(),
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-12-31T23:59:59.999Z'),
        new Date(2024, 0, 1), // January 1, 2024
        new Date(2024, 11, 31), // December 31, 2024
      ];

      validDates.forEach((date) => {
        expect(() => {
          new CropPlantingDateValueObject(date);
        }).not.toThrow();
      });
    });
  });

  describe('toISOString', () => {
    it('should return ISO string for valid date', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const plantingDate = new CropPlantingDateValueObject(date);

      expect(plantingDate.toISOString()).toBe('2024-01-15T10:30:00.000Z');
    });

    it('should return undefined for undefined date', () => {
      const plantingDate = new CropPlantingDateValueObject(undefined);

      expect(plantingDate.toISOString()).toBeUndefined();
    });

    it('should return correct ISO string for different dates', () => {
      const testCases = [
        {
          date: new Date('2024-01-01T00:00:00.000Z'),
          expected: '2024-01-01T00:00:00.000Z',
        },
        {
          date: new Date('2024-06-15T12:30:45.123Z'),
          expected: '2024-06-15T12:30:45.123Z',
        },
        {
          date: new Date('2024-12-31T23:59:59.999Z'),
          expected: '2024-12-31T23:59:59.999Z',
        },
      ];

      testCases.forEach(({ date, expected }) => {
        const plantingDate = new CropPlantingDateValueObject(date);
        expect(plantingDate.toISOString()).toBe(expected);
      });
    });
  });

  describe('getters', () => {
    it('should return correct date value', () => {
      const date = new Date('2024-03-20');
      const plantingDate = new CropPlantingDateValueObject(date);

      expect(plantingDate.date).toEqual(date);
      expect(plantingDate.value).toEqual(date);
    });

    it('should return undefined for undefined date', () => {
      const plantingDate = new CropPlantingDateValueObject(undefined);

      expect(plantingDate.date).toBeUndefined();
      expect(plantingDate.value).toBeUndefined();
    });
  });

  describe('immutability', () => {
    it('should be immutable after creation', () => {
      const originalDate = new Date('2024-05-10');
      const plantingDate = new CropPlantingDateValueObject(originalDate);

      // The value should remain the same
      expect(plantingDate.value).toEqual(originalDate);
      expect(plantingDate.date).toEqual(originalDate);

      // Modifying the original date should not affect the value object
      originalDate.setFullYear(2025);
      expect(plantingDate.value).toEqual(originalDate);
    });
  });

  describe('edge cases', () => {
    it('should handle dates with milliseconds', () => {
      const dateWithMs = new Date('2024-01-15T10:30:45.123Z');
      const plantingDate = new CropPlantingDateValueObject(dateWithMs);

      expect(plantingDate.toISOString()).toBe('2024-01-15T10:30:45.123Z');
    });

    it('should handle dates in different timezones', () => {
      const utcDate = new Date('2024-01-15T10:30:00.000Z');
      const localDate = new Date('2024-01-15T10:30:00.000');

      const utcPlantingDate = new CropPlantingDateValueObject(utcDate);
      const localPlantingDate = new CropPlantingDateValueObject(localDate);

      expect(utcPlantingDate.toISOString()).toBe('2024-01-15T10:30:00.000Z');
      expect(localPlantingDate.toISOString()).not.toBe(
        '2024-01-15T10:30:00.000Z',
      );
    });
  });
});
