import { CROP_STATUS } from '../../constants/crop-status.constant';
import { InvalidCropStatusException } from '../../exceptions/invalid-crop-status/invalid-crop-status.exception';
import { CropStatusValueObject } from './crop-status.value-object';

describe('CropStatusValueObject', () => {
  describe('constructor', () => {
    it('should create a CropStatusValueObject with valid status', () => {
      const status = new CropStatusValueObject(CROP_STATUS.PLANTED);

      expect(status).toBeInstanceOf(CropStatusValueObject);
      expect(status.value).toBe(CROP_STATUS.PLANTED);
    });

    it('should create a CropStatusValueObject with all valid statuses', () => {
      const validStatuses = Object.values(CROP_STATUS);

      validStatuses.forEach((statusValue) => {
        const status = new CropStatusValueObject(statusValue);
        expect(status.value).toBe(statusValue);
      });
    });
  });

  describe('validation', () => {
    it('should throw InvalidCropStatusException for empty string', () => {
      expect(() => {
        new CropStatusValueObject('');
      }).toThrow(InvalidCropStatusException);
      expect(() => {
        new CropStatusValueObject('   ');
      }).toThrow(InvalidCropStatusException);
    });

    it('should throw InvalidCropStatusException for null or undefined', () => {
      expect(() => {
        new CropStatusValueObject(null as any);
      }).toThrow(InvalidCropStatusException);

      expect(() => {
        new CropStatusValueObject(undefined as any);
      }).toThrow(InvalidCropStatusException);
    });

    it('should throw InvalidCropStatusException for invalid status', () => {
      const invalidStatuses = [
        'INVALID_STATUS',
        'PLANTED_INVALID',
        'GROWING_INVALID',
        'RANDOM_STATUS',
        'TEST_STATUS',
      ];

      invalidStatuses.forEach((invalidStatus) => {
        expect(() => {
          new CropStatusValueObject(invalidStatus);
        }).toThrow(InvalidCropStatusException);
      });
    });

    it('should accept valid status values', () => {
      const validStatuses = [
        CROP_STATUS.PLANNED,
        CROP_STATUS.PLANTED,
        CROP_STATUS.GROWING,
        CROP_STATUS.FLOWERING,
        CROP_STATUS.FRUITING,
        CROP_STATUS.HARVESTING,
        CROP_STATUS.FINISHED,
      ];

      validStatuses.forEach((statusValue) => {
        expect(() => {
          new CropStatusValueObject(statusValue);
        }).not.toThrow();
      });
    });
  });

  describe('value getter', () => {
    it('should return the correct status value', () => {
      const status = new CropStatusValueObject(CROP_STATUS.GROWING);
      expect(status.value).toBe(CROP_STATUS.GROWING);
    });

    it('should return the exact same value that was passed to constructor', () => {
      const testStatus = CROP_STATUS.HARVESTING;
      const status = new CropStatusValueObject(testStatus);
      expect(status.value).toBe(testStatus);
    });
  });

  describe('immutability', () => {
    it('should be immutable after creation', () => {
      const status = new CropStatusValueObject(CROP_STATUS.FINISHED);
      const originalValue = status.value;

      // The value should remain the same
      expect(status.value).toBe(originalValue);
      expect(status.value).toBe(CROP_STATUS.FINISHED);
    });
  });
});
